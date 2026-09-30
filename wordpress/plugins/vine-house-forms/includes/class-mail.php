<?php
/**
 * The acknowledgement a visitor receives after sending a form: a welcome to
 * the journal, a receipt for an enquiry or prayer request, and the pass for
 * a planned visit.
 *
 * They wear the same design as the booking emails. The template lives in
 * Vine House Events (Vine_Events_Email); with that plugin inactive the
 * message still goes out, as plain text. The photograph, the sender name and
 * the website address are the ones set under Events → Settings, so every
 * email a visitor gets from the church looks and reads as one voice.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Forms_Mail {

	/** The acknowledgements, by the record type that triggers each. */
	public const KINDS = array( 'subscribed', 'enquiry', 'visit' );

	public static function subscribed( int $post_id ): void {
		self::send( 'subscribed', $post_id );
	}

	public static function enquiry( int $post_id ): void {
		self::send( 'enquiry', $post_id );
	}

	public static function visit( int $post_id ): void {
		self::send( 'visit', $post_id );
	}

	/** The designed email for one kind of acknowledgement, for looking at before it is sent. */
	public static function preview( string $kind, int $post_id ): string {
		return in_array( $kind, self::KINDS, true ) ? self::compose( $kind, $post_id )['html'] : '';
	}

	// ---- where things point and who is writing -----------------------------

	/** The website, not WordPress: where every link in an email points. */
	private static function site_url(): string {
		$url = (string) get_option( 'vine_events_frontend_url', '' );
		if ( '' === $url && defined( 'VINE_FRONTEND_URL' ) ) {
			$url = (string) VINE_FRONTEND_URL;
		}
		return rtrim( $url ?: home_url(), '/' );
	}

	private static function from_name(): string {
		return (string) get_option( 'vine_events_from_name', '' ) ?: 'Vine House Ministries';
	}

	private static function image_url(): string {
		return (string) apply_filters( 'vine_forms_email_image', (string) get_option( 'vine_events_email_image', '' ) );
	}

	private static function setting( string $field ): string {
		return function_exists( 'get_field' ) ? trim( (string) get_field( $field, 'option' ) ) : '';
	}

	private static function meta( int $post_id, string $key ): string {
		return (string) get_post_meta( $post_id, $key, true );
	}

	private static function first_name( string $name ): string {
		$parts = preg_split( '/\s+/', trim( $name ) ) ?: array();
		return $parts[0] ?? $name;
	}

	// ---- what each acknowledgement says ------------------------------------

	/**
	 * @return array{subject: string, eyebrow: string, heading: string, greeting: string, paragraphs: string[],
	 *               facts: array<string, string>, pass: ?array, button: array, footer_note: string}
	 */
	private static function words( string $kind, int $post_id ): array {
		$site = self::site_url();

		if ( 'subscribed' === $kind ) {
			$frequency = self::meta( $post_id, 'vh_frequency' );
			$what      = array(
				'Weekly Devotional'   => __( 'the weekly devotional from the pastoral team', 'vine-house-forms' ),
				'Event Announcements' => __( 'news of upcoming events and gatherings', 'vine-house-forms' ),
			)[ $frequency ] ?? __( 'the weekly devotional and news of upcoming events', 'vine-house-forms' );

			return array(
				'subject'     => __( 'Welcome to the Vine journal', 'vine-house-forms' ),
				'eyebrow'     => __( 'The weekly Vine journal', 'vine-house-forms' ),
				'heading'     => __( 'You are on the list', 'vine-house-forms' ),
				'greeting'    => __( 'Hello,', 'vine-house-forms' ),
				'paragraphs'  => array(
					sprintf( /* translators: %s: what they subscribed to */ __( 'Thank you for subscribing. We will write to this address with %s, and nothing else.', 'vine-house-forms' ), $what ),
					__( 'To stop at any time, reply to any of our emails with the word unsubscribe and we will take you off the list.', 'vine-house-forms' ),
				),
				'facts'       => array(
					__( 'Subscribed', 'vine-house-forms' ) => self::meta( $post_id, 'vh_email' ),
					__( 'Updates', 'vine-house-forms' )    => $frequency ?: 'All Updates',
				),
				'pass'        => null,
				'button'      => array(
					'label' => __( 'Read the journal', 'vine-house-forms' ),
					'url'   => $site . '/messages',
					'intro' => __( 'In the meantime, the journal is open:', 'vine-house-forms' ),
				),
				'footer_note' => __( 'You are receiving this because this address was subscribed to the Vine House Ministries journal on our website. If that was not you, reply and we will remove it.', 'vine-house-forms' ),
			);
		}

		if ( 'enquiry' === $kind ) {
			$category  = self::meta( $post_id, 'vh_category' );
			$gathering = self::meta( $post_id, 'vh_gathering_title' );
			$labels    = array(
				'general'    => __( 'General enquiry', 'vine-house-forms' ),
				'prayer'     => __( 'Prayer request', 'vine-house-forms' ),
				'sacraments' => __( 'Sacraments & rites', 'vine-house-forms' ),
				'charity'    => __( 'Charity & partnership', 'vine-house-forms' ),
				'gathering'  => __( 'Gathering enquiry', 'vine-house-forms' ),
			);
			$label     = $labels[ $category ] ?? $labels['general'];
			$prayer    = 'prayer' === $category;

			return array(
				'subject'     => $prayer ? __( 'Your prayer request is with us', 'vine-house-forms' ) : __( 'We have received your message', 'vine-house-forms' ),
				'eyebrow'     => $label,
				'heading'     => $prayer ? __( 'Your prayer request is with us', 'vine-house-forms' ) : __( 'We have your message', 'vine-house-forms' ),
				'greeting'    => sprintf( /* translators: %s: first name */ __( 'Dear %s,', 'vine-house-forms' ), self::first_name( self::meta( $post_id, 'vh_name' ) ) ),
				'paragraphs'  => $prayer
					? array(
						__( 'Thank you for trusting us with this. Your request has reached the pastoral team, who will hold it in confidence.', 'vine-house-forms' ),
						__( 'If you would like someone to pray with you in person, you are welcome at any of our gatherings.', 'vine-house-forms' ),
					)
					: array(
						__( 'Thank you for writing to Vine House Ministries. Your message has reached the ministry office, and someone will reply to you personally as soon as we can.', 'vine-house-forms' ),
					),
				'facts'       => array_filter(
					array(
						__( 'Reference', 'vine-house-forms' ) => 'VH-' . $post_id,
						__( 'Regarding', 'vine-house-forms' ) => $label . ( $gathering ? ': ' . $gathering : '' ),
						__( 'Received', 'vine-house-forms' )  => wp_date( 'l, j F Y', (int) get_post_time( 'U', true, $post_id ) ),
					)
				),
				'pass'        => null,
				'button'      => array(
					'label' => __( 'Plan a visit', 'vine-house-forms' ),
					'url'   => $site . '/visit',
					'intro' => __( 'You would be very welcome to join us on a Sunday:', 'vine-house-forms' ),
				),
				'footer_note' => __( 'You are receiving this because this address was used to contact Vine House Ministries through our website.', 'vine-house-forms' ),
			);
		}

		// visit
		$party    = max( 1, (int) self::meta( $post_id, 'vh_party_size' ) );
		$date     = self::meta( $post_id, 'vh_visit_date' );
		$children = (bool) self::meta( $post_id, 'vh_children' );
		$ages     = self::meta( $post_id, 'vh_children_ages' );
		$where    = self::setting( 'address_line' );
		$access   = self::setting( 'access_note' );
		$parsed   = $date ? DateTimeImmutable::createFromFormat( '!Y-m-d', $date, wp_timezone() ) : false;

		$facts = array( __( 'Service', 'vine-house-forms' ) => self::meta( $post_id, 'vh_service' ) );
		if ( $parsed ) {
			$facts[ __( 'Date', 'vine-house-forms' ) ] = wp_date( 'l, j F Y', $parsed->getTimestamp() );
		}
		$facts[ __( 'Party', 'vine-house-forms' ) ] = sprintf( /* translators: %d: people */ _n( '%d person', '%d people', $party, 'vine-house-forms' ), $party );
		if ( $children ) {
			$facts[ __( 'Children', 'vine-house-forms' ) ] = $ages ? sprintf( /* translators: %s: ages */ __( 'Yes, aged %s', 'vine-house-forms' ), $ages ) : __( 'Yes', 'vine-house-forms' );
		}
		if ( '' !== $where ) {
			$facts[ __( 'Where', 'vine-house-forms' ) ] = $where;
		}
		if ( '' !== $access ) {
			$facts[ __( 'Access', 'vine-house-forms' ) ] = $access;
		}

		return array(
			'subject'     => __( 'We are expecting you', 'vine-house-forms' ),
			'eyebrow'     => __( 'Your visit', 'vine-house-forms' ),
			'heading'     => __( 'We are expecting you', 'vine-house-forms' ),
			'greeting'    => sprintf( /* translators: %s: first name */ __( 'Dear %s,', 'vine-house-forms' ), self::first_name( self::meta( $post_id, 'vh_name' ) ) ),
			'paragraphs'  => array(
				self::meta( $post_id, 'vh_welcome_host' )
					? __( 'Thank you for planning a visit. A welcome host will meet you at the door and show you to your seats.', 'vine-house-forms' )
					: __( 'Thank you for planning a visit. There will be someone at the door to greet you.', 'vine-house-forms' ),
				__( 'Doors open thirty minutes before the service. Your pass code is below; show it if you would like to be shown to your seats.', 'vine-house-forms' ),
			),
			'facts'       => $facts,
			'pass'        => array(
				'code'   => self::meta( $post_id, 'vh_pass_code' ),
				'corner' => sprintf( /* translators: %d: guests */ _n( '%d guest', '%d guests', $party, 'vine-house-forms' ), $party ),
				'note'   => __( 'Show this at the sanctuary entrance. On your phone or written down, either is fine.', 'vine-house-forms' ),
			),
			'button'      => array(
				'label' => __( 'What to expect', 'vine-house-forms' ),
				'url'   => $site . '/visit',
				'intro' => __( 'Everything about a Sunday with us is here:', 'vine-house-forms' ),
			),
			'footer_note' => __( 'You are receiving this because this address was used to plan a visit to Vine House Ministries through our website.', 'vine-house-forms' ),
		);
	}

	/**
	 * One acknowledgement in both its forms.
	 *
	 * @return array{to: string, subject: string, html: string, text: string}
	 */
	private static function compose( string $kind, int $post_id ): array {
		$words  = self::words( $kind, $post_id );
		$office = Vine_Forms_Notify::recipient();

		// ---- plain text ----
		$lines = array_merge( array( $words['greeting'], '' ), $words['paragraphs'], array( '' ) );
		if ( ! empty( $words['pass'] ) ) {
			$lines[] = sprintf( /* translators: %s: pass code */ __( 'Pass code: %s', 'vine-house-forms' ), $words['pass']['code'] );
		}
		foreach ( $words['facts'] as $label => $value ) {
			$lines[] = $label . ': ' . $value;
		}
		array_push( $lines, '', $words['button']['intro'], $words['button']['url'], '', __( 'With every blessing,', 'vine-house-forms' ), 'Vine House Ministries' );

		// ---- designed, when the template is here ----
		$html = '';
		if ( class_exists( 'Vine_Events_Email' ) ) {
			$html = Vine_Events_Email::render(
				array(
					'preheader'      => $words['paragraphs'][0],
					'eyebrow'        => $words['eyebrow'],
					'heading'        => $words['heading'],
					'greeting'       => $words['greeting'],
					'paragraphs'     => $words['paragraphs'],
					'facts'          => $words['facts'],
					'pass'           => $words['pass'],
					'button'         => $words['button'],
					'image'          => self::image_url(),
					'image_alt'      => __( 'People standing together in worship', 'vine-house-forms' ),
					'site_url'       => self::site_url(),
					'office_email'   => $office,
					'charity_number' => self::setting( 'charity_number' ),
					'footer_note'    => $words['footer_note'],
				)
			);
		}

		return array(
			'to'      => self::meta( $post_id, 'vh_email' ),
			'subject' => $words['subject'],
			'html'    => $html,
			'text'    => implode( "\n", $lines ),
		);
	}

	private static function send( string $kind, int $post_id ): void {
		$message = self::compose( $kind, $post_id );
		if ( ! is_email( $message['to'] ) ) {
			return;
		}
		$office  = Vine_Forms_Notify::recipient();
		$headers = array(
			sprintf( 'From: %s <%s>', self::from_name(), $office ),
			sprintf( 'Reply-To: %s', $office ),
		);

		if ( '' === $message['html'] ) {
			wp_mail( $message['to'], $message['subject'], $message['text'], $headers );
			return;
		}

		// The plain-text alternative rides with the HTML body; WordPress clears it again before the next message.
		$text    = $message['text'];
		$set_alt = static function ( $phpmailer ) use ( $text ): void {
			$phpmailer->AltBody = $text; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		};
		add_action( 'phpmailer_init', $set_alt );
		wp_mail( $message['to'], $message['subject'], $message['html'], array_merge( $headers, array( 'Content-Type: text/html; charset=UTF-8' ) ) );
		remove_action( 'phpmailer_init', $set_alt );
	}
}
