<?php
/**
 * Every email the plugin sends. Plain text throughout: it renders the same
 * everywhere and never trips a spam filter on markup.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Mail {

	public const OPTION_NOTIFY    = 'vine_events_notify_email';
	public const OPTION_FRONTEND  = 'vine_events_frontend_url';
	public const OPTION_REMINDERS = 'vine_events_reminders';
	public const OPTION_FROM_NAME = 'vine_events_from_name';

	public static function office_address(): string {
		$email = (string) get_option( self::OPTION_NOTIFY, '' ) ?: (string) get_option( 'admin_email' );
		return (string) apply_filters( 'vine_events_notify_email', $email );
	}

	/** Where "manage my booking" links point: the website, not WordPress. */
	public static function manage_url( int $booking_id ): string {
		$base  = rtrim( (string) get_option( self::OPTION_FRONTEND, '' ) ?: home_url(), '/' );
		$token = (string) get_post_meta( $booking_id, 'vh_token', true );
		return $base . '/events/booking?token=' . rawurlencode( $token );
	}

	// ---- to the attendee ---------------------------------------------------

	public static function confirmation( int $booking_id ): void {
		self::to_attendee(
			$booking_id,
			__( 'Your place is confirmed', 'vine-house-events' ),
			array(
				sprintf( /* translators: %s: pass code */ __( 'Your pass code is %s. Show it at the door, on your phone or written down.', 'vine-house-events' ), self::meta( $booking_id, 'vh_pass_code' ) ),
				'',
				__( 'A calendar file is attached. If your plans change, you can cancel here:', 'vine-house-events' ),
				self::manage_url( $booking_id ),
			),
			true
		);
	}

	public static function waitlisted( int $booking_id ): void {
		self::to_attendee(
			$booking_id,
			__( 'You are on the waitlist', 'vine-house-events' ),
			array(
				__( 'This event is full for now. You are on the waitlist, and we will email you the moment a place opens up.', 'vine-house-events' ),
				'',
				__( 'If you no longer need it, you can take yourself off the list here:', 'vine-house-events' ),
				self::manage_url( $booking_id ),
			)
		);
	}

	public static function promoted( int $booking_id ): void {
		self::to_attendee(
			$booking_id,
			__( 'A place has opened up — you are confirmed', 'vine-house-events' ),
			array(
				sprintf( /* translators: %s: pass code */ __( 'Good news: a place came free and your booking is now confirmed. Your pass code is %s.', 'vine-house-events' ), self::meta( $booking_id, 'vh_pass_code' ) ),
				'',
				__( 'A calendar file is attached. If you can no longer come, please cancel so the place can go to someone else:', 'vine-house-events' ),
				self::manage_url( $booking_id ),
			),
			true
		);
	}

	public static function cancelled( int $booking_id ): void {
		self::to_attendee(
			$booking_id,
			__( 'Your booking is cancelled', 'vine-house-events' ),
			array(
				__( 'Your booking has been cancelled and the places released. You are always welcome to book again if plans change.', 'vine-house-events' ),
			)
		);
	}

	public static function reminder( int $booking_id ): void {
		self::to_attendee(
			$booking_id,
			__( 'See you tomorrow', 'vine-house-events' ),
			array(
				sprintf( /* translators: %s: pass code */ __( 'A reminder that you are booked in for tomorrow. Your pass code is %s.', 'vine-house-events' ), self::meta( $booking_id, 'vh_pass_code' ) ),
				'',
				__( 'If you can no longer make it, cancelling frees the place for someone on the waitlist:', 'vine-house-events' ),
				self::manage_url( $booking_id ),
			)
		);
	}

	// ---- to the office -----------------------------------------------------

	public static function office( int $booking_id ): void {
		$event_id = (int) self::meta( $booking_id, 'vh_event_id' );
		$counts   = Vine_Events_Bookings::counts( $event_id );
		$capacity = (int) get_post_meta( $event_id, 'vh_capacity', true );
		$lines    = array(
			sprintf( 'Event: %s', get_the_title( $event_id ) ),
			sprintf( 'When: %s', Vine_Events_Event_Type::when( $event_id ) ),
			'',
			sprintf( 'Name: %s', self::meta( $booking_id, 'vh_name' ) ),
			sprintf( 'Email: %s', self::meta( $booking_id, 'vh_email' ) ),
			sprintf( 'Phone: %s', self::meta( $booking_id, 'vh_phone' ) ?: '—' ),
			sprintf( 'Guests: %d', (int) self::meta( $booking_id, 'vh_guests' ) ),
			sprintf( 'Status: %s', self::meta( $booking_id, 'vh_status' ) ),
			sprintf( 'First visit: %s', self::meta( $booking_id, 'vh_first_time' ) ? 'yes' : 'no' ),
			sprintf( 'Source: %s', self::meta( $booking_id, 'vh_source' ) ),
		);
		if ( '' !== self::meta( $booking_id, 'vh_notes' ) ) {
			$lines[] = '';
			$lines[] = 'Notes: ' . self::meta( $booking_id, 'vh_notes' );
		}
		$lines[] = '';
		$lines[] = $capacity > 0
			? sprintf( 'Now %d of %d places taken, %d on the waitlist.', $counts['confirmed_guests'], $capacity, $counts['waitlisted_guests'] )
			: sprintf( 'Now %d guests confirmed.', $counts['confirmed_guests'] );
		$lines[] = 'Bookings: ' . admin_url( 'edit.php?post_type=' . Vine_Events_Booking_Type::TYPE . '&vh_event=' . $event_id );

		wp_mail(
			self::office_address(),
			sprintf( '[Vine House] New booking: %s', get_the_title( $event_id ) ),
			implode( "\n", $lines ),
			self::headers()
		);
	}

	// ---- shared ------------------------------------------------------------

	private static function to_attendee( int $booking_id, string $subject, array $body_lines, bool $attach_ics = false ): void {
		$event_id = (int) self::meta( $booking_id, 'vh_event_id' );
		$details  = Vine_Events_Event_Type::details( $event_id );
		$lines    = array_merge(
			array(
				sprintf( /* translators: %s: first name */ __( 'Dear %s,', 'vine-house-events' ), self::first_name( self::meta( $booking_id, 'vh_name' ) ) ),
				'',
			),
			$body_lines,
			array(
				'',
				get_the_title( $event_id ),
				Vine_Events_Event_Type::when( $event_id ),
				trim( $details['location'] . ( $details['room'] ? ', ' . $details['room'] : '' ) ),
				sprintf( /* translators: %d: guests */ __( 'Guests: %d', 'vine-house-events' ), (int) self::meta( $booking_id, 'vh_guests' ) ),
			)
		);
		if ( $details['onlineUrl'] ) {
			$lines[] = __( 'Join online:', 'vine-house-events' ) . ' ' . $details['onlineUrl'];
		}
		$lines[] = '';
		$lines[] = __( 'With every blessing,', 'vine-house-events' );
		$lines[] = 'Vine House Ministries';

		$attachments = array();
		if ( $attach_ics ) {
			$ics = Vine_Events_ICS::build( $booking_id );
			if ( '' !== $ics ) {
				$path = wp_tempnam( 'vine-house-event.ics' );
				if ( $path && false !== file_put_contents( $path, $ics ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
					$renamed = preg_replace( '/\.tmp$/', '', $path ) . '.ics';
					if ( rename( $path, $renamed ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.rename_rename
						$path = $renamed;
					}
					$attachments[] = $path;
				}
			}
		}

		wp_mail(
			self::meta( $booking_id, 'vh_email' ),
			sprintf( '%s — %s', $subject, get_the_title( $event_id ) ),
			implode( "\n", $lines ),
			self::headers(),
			$attachments
		);

		foreach ( $attachments as $path ) {
			wp_delete_file( $path );
		}
	}

	private static function headers(): array {
		$name = (string) get_option( self::OPTION_FROM_NAME, '' ) ?: 'Vine House Ministries';
		$from = self::office_address();
		return array( sprintf( 'From: %s <%s>', $name, $from ), sprintf( 'Reply-To: %s', $from ) );
	}

	private static function meta( int $booking_id, string $key ): string {
		return (string) get_post_meta( $booking_id, $key, true );
	}

	private static function first_name( string $name ): string {
		$parts = preg_split( '/\s+/', trim( $name ) ) ?: array();
		return $parts[0] ?? $name;
	}
}
