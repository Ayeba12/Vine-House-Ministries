<?php
/**
 * The booking rules, in one place, used by the REST endpoints, the office's
 * Add Booking screen and the admin row actions alike.
 *
 * Capacity counts guests, not bookings. A booking is confirmed when its
 * guests fit, waitlisted when the event is full and allows it, refused
 * otherwise. Cancelling a confirmed booking promotes the waitlist in order,
 * as far as the freed places allow.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Bookings {

	/**
	 * @param array{name:string,email:string,phone:string,guests:int,first_time:bool,notes:string} $data
	 * @return array<string, mixed>|WP_Error the booking payload, or an error carrying an HTTP status
	 */
	public static function create( int $event_id, array $data, string $source = 'web', string $client_ip = '' ) {
		$event = get_post( $event_id );
		if ( ! $event || Vine_Events_Event_Type::TYPE !== $event->post_type || 'publish' !== $event->post_status ) {
			return new WP_Error( 'vine_events_no_event', __( 'That event is no longer available.', 'vine-house-events' ), array( 'status' => 404 ) );
		}

		// The office can book past the window and past capacity; the website cannot.
		$office = 'office' === $source;

		$details = Vine_Events_Event_Type::details( $event_id );
		if ( ! $office ) {
			$blocked = array(
				'disabled'     => __( 'This event does not take bookings.', 'vine-house-events' ),
				'not_yet_open' => __( 'Booking has not opened yet.', 'vine-house-events' ),
				'closed'       => __( 'Booking has closed for this event.', 'vine-house-events' ),
			);
			if ( isset( $blocked[ $details['bookingStatus'] ] ) ) {
				return new WP_Error( 'vine_events_' . $details['bookingStatus'], $blocked[ $details['bookingStatus'] ], array( 'status' => 409 ) );
			}
			if ( $data['guests'] > $details['maxGuestsPerBooking'] ) {
				return new WP_Error(
					'vine_events_too_many',
					sprintf( /* translators: %d: guests */ __( 'One booking can cover at most %d guests.', 'vine-house-events' ), $details['maxGuestsPerBooking'] ),
					array(
						'status' => 400,
						'field'  => 'guestsCount',
					)
				);
			}
		}

		// Idempotent: the same email booking the same event again gets the
		// original booking back rather than a duplicate.
		$existing = self::find_active( $event_id, $data['email'] );
		if ( $existing ) {
			return self::payload( $existing ) + array( 'existing' => true );
		}

		$status = Vine_Events_Booking_Type::CONFIRMED;
		if ( $details['capacity'] > 0 && $data['guests'] > (int) $details['remaining'] ) {
			if ( $office || ! $details['waitlistEnabled'] ) {
				if ( ! $office ) {
					return new WP_Error(
						'vine_events_full',
						__( 'There are not enough places left for that many guests.', 'vine-house-events' ),
						array(
							'status'    => 409,
							'remaining' => (int) $details['remaining'],
						)
					);
				}
				// The office overbooks knowingly; the record still says confirmed.
			} else {
				$status = Vine_Events_Booking_Type::WAITLISTED;
			}
		}

		$booking_id = wp_insert_post(
			array(
				'post_type'   => Vine_Events_Booking_Type::TYPE,
				'post_status' => 'publish',
				'post_title'  => wp_strip_all_tags( sprintf( '%s — %s (%d)', $data['name'], $event->post_title, $data['guests'] ) ),
			),
			true
		);
		if ( is_wp_error( $booking_id ) ) {
			return $booking_id;
		}

		foreach (
			array(
				'vh_event_id'   => $event_id,
				'vh_name'       => $data['name'],
				'vh_email'      => $data['email'],
				'vh_phone'      => $data['phone'],
				'vh_guests'     => $data['guests'],
				'vh_first_time' => $data['first_time'] ? 1 : 0,
				'vh_notes'      => $data['notes'],
				'vh_status'     => $status,
				'vh_pass_code'  => self::pass_code(),
				'vh_token'      => bin2hex( random_bytes( 16 ) ),
				'vh_checked_in' => 0,
				'vh_source'     => $source,
				'vh_client_ip'  => $client_ip,
				'vh_reminded'   => 0,
			) as $key => $value
		) {
			update_post_meta( $booking_id, $key, $value );
		}

		if ( Vine_Events_Booking_Type::WAITLISTED === $status ) {
			Vine_Events_Mail::waitlisted( $booking_id );
		} else {
			Vine_Events_Mail::confirmation( $booking_id );
		}
		Vine_Events_Mail::office( $booking_id );

		return self::payload( $booking_id ) + array( 'existing' => false );
	}

	/** @return array<string, mixed>|WP_Error */
	public static function cancel_by_token( string $token ) {
		$booking_id = self::find_by_token( $token );
		if ( ! $booking_id ) {
			return new WP_Error( 'vine_events_no_booking', __( 'We could not find that booking.', 'vine-house-events' ), array( 'status' => 404 ) );
		}
		self::cancel( $booking_id );
		return self::payload( $booking_id );
	}

	public static function cancel( int $booking_id ): void {
		$status = (string) get_post_meta( $booking_id, 'vh_status', true );
		if ( Vine_Events_Booking_Type::CANCELLED === $status ) {
			return;
		}
		update_post_meta( $booking_id, 'vh_status', Vine_Events_Booking_Type::CANCELLED );
		update_post_meta( $booking_id, 'vh_cancelled_at', current_time( 'mysql' ) );
		Vine_Events_Mail::cancelled( $booking_id );

		if ( Vine_Events_Booking_Type::CONFIRMED === $status ) {
			self::promote_waitlist( (int) get_post_meta( $booking_id, 'vh_event_id', true ) );
		}
	}

	/** Confirm waitlisted bookings, oldest first, while their guests fit. Returns how many were promoted. */
	public static function promote_waitlist( int $event_id ): int {
		$capacity = (int) get_post_meta( $event_id, 'vh_capacity', true );
		if ( 0 === $capacity ) {
			return 0;
		}
		$promoted = 0;
		foreach ( self::ids_for_event( $event_id, Vine_Events_Booking_Type::WAITLISTED, 'ASC' ) as $booking_id ) {
			$remaining = $capacity - self::confirmed_guests( $event_id );
			if ( (int) get_post_meta( $booking_id, 'vh_guests', true ) > $remaining ) {
				// Keep order: a large party at the front waits until it fits.
				break;
			}
			update_post_meta( $booking_id, 'vh_status', Vine_Events_Booking_Type::CONFIRMED );
			Vine_Events_Mail::promoted( $booking_id );
			++$promoted;
		}
		return $promoted;
	}

	public static function set_checked_in( int $booking_id, bool $checked_in ): void {
		update_post_meta( $booking_id, 'vh_checked_in', $checked_in ? 1 : 0 );
	}

	// ---- counting ----------------------------------------------------------

	public static function confirmed_guests( int $event_id ): int {
		return self::sum_guests( $event_id, Vine_Events_Booking_Type::CONFIRMED );
	}

	public static function waitlisted_guests( int $event_id ): int {
		return self::sum_guests( $event_id, Vine_Events_Booking_Type::WAITLISTED );
	}

	/** @return array{confirmed:int,confirmed_guests:int,waitlisted:int,waitlisted_guests:int,cancelled:int,checked_in:int} */
	public static function counts( int $event_id ): array {
		$out = array(
			'confirmed'         => 0,
			'confirmed_guests'  => 0,
			'waitlisted'        => 0,
			'waitlisted_guests' => 0,
			'cancelled'         => 0,
			'checked_in'        => 0,
		);
		foreach ( self::ids_for_event( $event_id ) as $id ) {
			$status = (string) get_post_meta( $id, 'vh_status', true );
			$guests = (int) get_post_meta( $id, 'vh_guests', true );
			if ( isset( $out[ $status ] ) ) {
				++$out[ $status ];
			}
			if ( isset( $out[ $status . '_guests' ] ) ) {
				$out[ $status . '_guests' ] += $guests;
			}
			if ( Vine_Events_Booking_Type::CONFIRMED === $status && get_post_meta( $id, 'vh_checked_in', true ) ) {
				$out['checked_in'] += $guests;
			}
		}
		return $out;
	}

	private static function sum_guests( int $event_id, string $status ): int {
		$total = 0;
		foreach ( self::ids_for_event( $event_id, $status ) as $id ) {
			$total += (int) get_post_meta( $id, 'vh_guests', true );
		}
		return $total;
	}

	/** @return int[] booking ids for an event, optionally one status, by creation date */
	public static function ids_for_event( int $event_id, ?string $status = null, string $order = 'DESC' ): array {
		$meta = array(
			array(
				'key'   => 'vh_event_id',
				'value' => $event_id,
			),
		);
		if ( $status ) {
			$meta[] = array(
				'key'   => 'vh_status',
				'value' => $status,
			);
		}
		return get_posts(
			array(
				'post_type'      => Vine_Events_Booking_Type::TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'orderby'        => 'date',
				'order'          => $order,
				'meta_query'     => $meta, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'no_found_rows'  => true,
			)
		);
	}

	private static function find_active( int $event_id, string $email ): int {
		$ids = get_posts(
			array(
				'post_type'      => Vine_Events_Booking_Type::TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					array(
						'key'   => 'vh_event_id',
						'value' => $event_id,
					),
					array(
						'key'   => 'vh_email',
						'value' => $email,
					),
					array(
						'key'     => 'vh_status',
						'value'   => Vine_Events_Booking_Type::CANCELLED,
						'compare' => '!=',
					),
				),
			)
		);
		return $ids ? (int) $ids[0] : 0;
	}

	public static function find_by_token( string $token ): int {
		if ( ! preg_match( '/^[a-f0-9]{32}$/', $token ) ) {
			return 0;
		}
		$ids = get_posts(
			array(
				'post_type'      => Vine_Events_Booking_Type::TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_key'       => 'vh_token', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'     => $token, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
			)
		);
		return $ids ? (int) $ids[0] : 0;
	}

	// ---- output ------------------------------------------------------------

	/** What the website gets back. Never includes the token except right here, for the cancel link. */
	public static function payload( int $booking_id ): array {
		$event_id = (int) get_post_meta( $booking_id, 'vh_event_id', true );
		$details  = Vine_Events_Event_Type::details( $event_id );
		return array(
			'id'          => $booking_id,
			'status'      => (string) get_post_meta( $booking_id, 'vh_status', true ),
			'passCode'    => (string) get_post_meta( $booking_id, 'vh_pass_code', true ),
			'token'       => (string) get_post_meta( $booking_id, 'vh_token', true ),
			'name'        => (string) get_post_meta( $booking_id, 'vh_name', true ),
			'guests'      => (int) get_post_meta( $booking_id, 'vh_guests', true ),
			'checkedIn'   => (bool) get_post_meta( $booking_id, 'vh_checked_in', true ),
			'event'       => array(
				'id'        => $event_id,
				'title'     => get_the_title( $event_id ),
				'when'      => Vine_Events_Event_Type::when( $event_id ),
				'eventDate' => $details['eventDate'],
				'startTime' => $details['startTime'],
				'location'  => $details['location'],
				'room'      => $details['room'],
				'remaining' => $details['remaining'],
			),
		);
	}

	/** Six characters from an alphabet with no 0/O or 1/I confusion. */
	private static function pass_code(): string {
		$alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		$code     = '';
		for ( $i = 0; $i < 6; $i++ ) {
			$code .= $alphabet[ random_int( 0, strlen( $alphabet ) - 1 ) ];
		}
		return 'VH-' . $code;
	}
}
