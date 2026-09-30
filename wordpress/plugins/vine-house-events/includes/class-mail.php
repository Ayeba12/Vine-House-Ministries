<?php
/**
 * Every email the plugin sends.
 *
 * An attendee gets the designed email (Vine_Events_Email) with the same
 * message in plain text alongside it, so a client that shows no HTML, and
 * every spam filter, still reads the whole thing. The office gets plain text:
 * it is a working notification, not a letter.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Mail {

	public const OPTION_NOTIFY    = 'vine_events_notify_email';
	public const OPTION_FRONTEND  = 'vine_events_frontend_url';
	public const OPTION_REMINDERS = 'vine_events_reminders';
	public const OPTION_FROM_NAME = 'vine_events_from_name';
	public const OPTION_IMAGE     = 'vine_events_email_image';

	/** The messages an attendee can receive. */
	public const KINDS = array( 'confirmation', 'waitlisted', 'promoted', 'cancelled', 'reminder' );

	public static function office_address(): string {
		$email = (string) get_option( self::OPTION_NOTIFY, '' ) ?: (string) get_option( 'admin_email' );
		return (string) apply_filters( 'vine_events_notify_email', $email );
	}

	/** The website, not WordPress: where every link in an email points. */
	public static function frontend_url(): string {
		return rtrim( (string) get_option( self::OPTION_FRONTEND, '' ) ?: home_url(), '/' );
	}

	/** Where "manage my booking" links point. */
	public static function manage_url( int $booking_id ): string {
		$token = (string) get_post_meta( $booking_id, 'vh_token', true );
		return self::frontend_url() . '/events/booking?token=' . rawurlencode( $token );
	}

	/** The photograph under the masthead of every attendee email. Empty for none. */
	public static function image_url(): string {
		return (string) apply_filters( 'vine_events_email_image', (string) get_option( self::OPTION_IMAGE, '' ) );
	}

	// ---- to the attendee ---------------------------------------------------

	public static function confirmation( int $booking_id ): void {
		self::to_attendee( 'confirmation', $booking_id );
	}

	public static function waitlisted( int $booking_id ): void {
		self::to_attendee( 'waitlisted', $booking_id );
	}

	public static function promoted( int $booking_id ): void {
		self::to_attendee( 'promoted', $booking_id );
	}

	public static function cancelled( int $booking_id ): void {
		self::to_attendee( 'cancelled', $booking_id );
	}

	public static function reminder( int $booking_id ): void {
		self::to_attendee( 'reminder', $booking_id );
	}

	/** The designed email for one kind of message, for looking at before it is sent. */
	public static function preview( string $kind, int $booking_id ): string {
		return in_array( $kind, self::KINDS, true ) ? self::compose( $kind, $booking_id )['html'] : '';
	}

	/**
	 * What each kind of message says. `pass` is how the pass card is drawn:
	 * its corner label and foot note, or null for the facts on a light tile.
	 *
	 * @return array{subject: string, eyebrow: string, paragraphs: string[], pass: ?array, button: array, ics: bool}
	 */
	private static function words( string $kind, int $booking_id ): array {
		$code   = self::meta( $booking_id, 'vh_pass_code' );
		$guests = (int) self::meta( $booking_id, 'vh_guests' );
		$party  = sprintf( /* translators: %d: guests */ _n( '%d guest', '%d guests', $guests, 'vine-house-events' ), $guests );
		$manage = array(
			'label' => __( 'Manage my booking', 'vine-house-events' ),
			'url'   => self::manage_url( $booking_id ),
		);
		$door   = __( 'Show this at the sanctuary entrance. On your phone or written down, either is fine.', 'vine-house-events' );

		switch ( $kind ) {
			case 'waitlisted':
				return array(
					'subject'    => __( 'You are on the waitlist', 'vine-house-events' ),
					'eyebrow'    => __( 'Waitlist', 'vine-house-events' ),
					'paragraphs' => array(
						__( 'This event is full for now. You are on the waitlist, and we will email you the moment a place opens up.', 'vine-house-events' ),
					),
					'pass'       => array(
						'code'   => $code,
						'corner' => __( 'Waitlist', 'vine-house-events' ),
						'note'   => __( 'This code becomes your pass the moment a place opens. We will email you.', 'vine-house-events' ),
					),
					'button'     => $manage + array( 'intro' => __( 'If you no longer need it, you can take yourself off the list here:', 'vine-house-events' ) ),
					'ics'        => false,
				);

			case 'promoted':
				return array(
					'subject'    => __( 'A place has opened up — you are confirmed', 'vine-house-events' ),
					'eyebrow'    => __( 'Place confirmed', 'vine-house-events' ),
					'paragraphs' => array(
						sprintf( /* translators: %s: pass code */ __( 'Good news: a place came free and your booking is now confirmed. Your pass code is %s.', 'vine-house-events' ), $code ),
						__( 'A calendar file is attached.', 'vine-house-events' ),
					),
					'pass'       => array( 'code' => $code, 'corner' => $party, 'note' => $door ),
					'button'     => $manage + array( 'intro' => __( 'If you can no longer come, please cancel so the place can go to someone else:', 'vine-house-events' ) ),
					'ics'        => true,
				);

			case 'cancelled':
				return array(
					'subject'    => __( 'Your booking is cancelled', 'vine-house-events' ),
					'eyebrow'    => __( 'Booking cancelled', 'vine-house-events' ),
					'paragraphs' => array(
						__( 'Your booking has been cancelled and the places released.', 'vine-house-events' ),
					),
					'pass'       => array(
						'code'     => $code,
						'corner'   => __( 'Cancelled', 'vine-house-events' ),
						'note'     => __( 'This pass is no longer valid.', 'vine-house-events' ),
						'released' => true,
					),
					'button'     => array(
						'label' => __( 'See upcoming events', 'vine-house-events' ),
						'url'   => self::frontend_url() . '/events',
						'intro' => __( 'You are always welcome to book again if plans change:', 'vine-house-events' ),
					),
					'ics'        => false,
				);

			case 'reminder':
				return array(
					'subject'    => __( 'See you tomorrow', 'vine-house-events' ),
					'eyebrow'    => __( 'Tomorrow', 'vine-house-events' ),
					'paragraphs' => array(
						sprintf( /* translators: %s: pass code */ __( 'A reminder that you are booked in for tomorrow. Your pass code is %s.', 'vine-house-events' ), $code ),
					),
					'pass'       => array( 'code' => $code, 'corner' => $party, 'note' => $door ),
					'button'     => $manage + array( 'intro' => __( 'If you can no longer make it, cancelling frees the place for someone on the waitlist:', 'vine-house-events' ) ),
					'ics'        => false,
				);

			default: // confirmation
				return array(
					'subject'    => __( 'Your place is confirmed', 'vine-house-events' ),
					'eyebrow'    => __( 'Booking confirmed', 'vine-house-events' ),
					'paragraphs' => array(
						sprintf( /* translators: %s: pass code */ __( 'Your pass code is %s. Show it at the door, on your phone or written down.', 'vine-house-events' ), $code ),
						__( 'A calendar file is attached.', 'vine-house-events' ),
					),
					'pass'       => array( 'code' => $code, 'corner' => $party, 'note' => $door ),
					'button'     => $manage + array( 'intro' => __( 'If your plans change, you can cancel here:', 'vine-house-events' ) ),
					'ics'        => true,
				);
		}
	}

	/**
	 * One message in both its forms.
	 *
	 * @return array{subject: string, html: string, text: string, ics: bool}
	 */
	private static function compose( string $kind, int $booking_id ): array {
		$event_id = (int) self::meta( $booking_id, 'vh_event_id' );
		$details  = Vine_Events_Event_Type::details( $event_id );
		$words    = self::words( $kind, $booking_id );
		$guests   = (int) self::meta( $booking_id, 'vh_guests' );
		$greeting = sprintf( /* translators: %s: first name */ __( 'Dear %s,', 'vine-house-events' ), self::first_name( self::meta( $booking_id, 'vh_name' ) ) );
		$where    = trim( $details['location'] . ( $details['room'] ? ', ' . $details['room'] : '' ) );

		$facts = array(
			__( 'Event', 'vine-house-events' ) => self::event_title( $event_id ),
			__( 'When', 'vine-house-events' )  => Vine_Events_Event_Type::when( $event_id ),
		);
		if ( '' !== $where ) {
			$facts[ __( 'Where', 'vine-house-events' ) ] = $where;
		}
		$facts[ __( 'Guests', 'vine-house-events' ) ] = (string) $guests;
		if ( $details['onlineUrl'] ) {
			$facts[ __( 'Join online', 'vine-house-events' ) ] = $details['onlineUrl'];
		}

		// ---- plain text ----
		$lines = array_merge( array( $greeting, '' ), $words['paragraphs'], array( '', $words['button']['intro'], $words['button']['url'], '' ) );
		foreach ( $facts as $label => $value ) {
			$lines[] = $label . ': ' . $value;
		}
		$lines[] = '';
		$lines[] = __( 'With every blessing,', 'vine-house-events' );
		$lines[] = 'Vine House Ministries';

		// ---- designed ----
		$html = Vine_Events_Email::render(
			array(
				'preheader'      => $words['paragraphs'][0],
				'eyebrow'        => $words['eyebrow'],
				'heading'        => $words['subject'],
				'greeting'       => $greeting,
				'paragraphs'     => $words['paragraphs'],
				'facts'          => $facts,
				'pass'           => $words['pass'],
				'button'         => $words['button'],
				'image'          => self::image_url(),
				'image_alt'      => __( 'People standing together in worship', 'vine-house-events' ),
				'site_url'       => self::frontend_url(),
				'office_email'   => self::office_address(),
				'charity_number' => function_exists( 'get_field' ) ? (string) get_field( 'charity_number', 'option' ) : '',
				'footer_note'    => __( 'You are receiving this because this address was used to book a place at a Vine House Ministries event.', 'vine-house-events' ),
			)
		);

		return array(
			'subject' => sprintf( '%s — %s', $words['subject'], self::event_title( $event_id ) ),
			'html'    => $html,
			'text'    => implode( "\n", $lines ),
			'ics'     => $words['ics'],
		);
	}

	private static function to_attendee( string $kind, int $booking_id ): void {
		$message = self::compose( $kind, $booking_id );

		$attachments = array();
		if ( $message['ics'] ) {
			$ics = Vine_Events_ICS::build( $booking_id );
			if ( '' !== $ics ) {
				// wp_tempnam() lives in an admin include that REST and cron requests do not load.
				require_once ABSPATH . 'wp-admin/includes/file.php';
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

		// The plain-text alternative rides with the HTML body; WordPress clears it again before the next message.
		$text    = $message['text'];
		$set_alt = static function ( $phpmailer ) use ( $text ): void {
			$phpmailer->AltBody = $text; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		};
		add_action( 'phpmailer_init', $set_alt );
		wp_mail(
			self::meta( $booking_id, 'vh_email' ),
			$message['subject'],
			$message['html'],
			array_merge( self::headers(), array( 'Content-Type: text/html; charset=UTF-8' ) ),
			$attachments
		);
		remove_action( 'phpmailer_init', $set_alt );

		foreach ( $attachments as $path ) {
			wp_delete_file( $path );
		}
	}

	// ---- to the office -----------------------------------------------------

	public static function office( int $booking_id ): void {
		$event_id = (int) self::meta( $booking_id, 'vh_event_id' );
		$counts   = Vine_Events_Bookings::counts( $event_id );
		$capacity = (int) get_post_meta( $event_id, 'vh_capacity', true );
		$lines    = array(
			sprintf( 'Event: %s', self::event_title( $event_id ) ),
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
			sprintf( '[Vine House] New booking: %s', self::event_title( $event_id ) ),
			implode( "\n", $lines ),
			self::headers()
		);
	}

	// ---- shared ------------------------------------------------------------

	/** The event's title as plain text: get_the_title() encodes "&" and quotes for HTML; the template escapes for itself. */
	private static function event_title( int $event_id ): string {
		return html_entity_decode( get_the_title( $event_id ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
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
