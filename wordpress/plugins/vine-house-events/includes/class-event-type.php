<?php
/**
 * The event post type, its category taxonomy, its meta, and how all of it
 * appears in WPGraphQL.
 *
 * Meta is registered natively rather than through ACF so the booking rules
 * (capacity, window, waitlist) cannot be edited away by someone changing a
 * field group. The frontend never sees WordPress HTML: publicly_queryable
 * is off and every value travels through GraphQL.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Event_Type {

	public const TYPE     = 'church_event';
	public const TAXONOMY = 'event_category';

	/** meta key => [type, default] */
	public const META = array(
		'vh_event_date'      => array( 'string', '' ),
		'vh_start_time'      => array( 'string', '' ),
		'vh_end_time'        => array( 'string', '' ),
		'vh_location'        => array( 'string', 'Sanctuary Hall' ),
		'vh_room'            => array( 'string', '' ),
		'vh_host'            => array( 'string', '' ),
		'vh_online_url'      => array( 'string', '' ),
		'vh_highlights'      => array( 'string', '' ),
		'vh_booking_enabled' => array( 'boolean', true ),
		'vh_capacity'        => array( 'integer', 0 ),
		'vh_max_guests'      => array( 'integer', 6 ),
		'vh_waitlist'        => array( 'boolean', true ),
		'vh_booking_opens'   => array( 'string', '' ),
		'vh_booking_closes'  => array( 'string', '' ),
	);

	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'register' ) );
		add_action( 'graphql_register_types', array( __CLASS__, 'graphql' ) );
	}

	public static function register(): void {
		register_post_type(
			self::TYPE,
			array(
				'label'               => __( 'Events', 'vine-house-events' ),
				'labels'              => array(
					'name'          => __( 'Events', 'vine-house-events' ),
					'singular_name' => __( 'Event', 'vine-house-events' ),
					'add_new_item'  => __( 'Add New Event', 'vine-house-events' ),
					'edit_item'     => __( 'Edit Event', 'vine-house-events' ),
					'menu_name'     => __( 'Events', 'vine-house-events' ),
				),
				'public'              => true,
				'publicly_queryable'  => false,
				'has_archive'         => false,
				'show_ui'             => true,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'churchEvent',
				'graphql_plural_name' => 'churchEvents',
				'menu_position'       => 21,
				'menu_icon'           => 'dashicons-calendar-alt',
				'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions' ),
				'taxonomies'          => array( self::TAXONOMY ),
			)
		);

		register_taxonomy(
			self::TAXONOMY,
			self::TYPE,
			array(
				'label'               => __( 'Event Categories', 'vine-house-events' ),
				'hierarchical'        => true,
				'public'              => true,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_admin_column'   => true,
				'show_in_rest'        => true,
				'show_in_graphql'     => true,
				'graphql_single_name' => 'eventCategory',
				'graphql_plural_name' => 'eventCategories',
			)
		);

		foreach ( self::META as $key => [ $type, $default ] ) {
			register_post_meta(
				self::TYPE,
				$key,
				array(
					'type'          => $type,
					'single'        => true,
					'default'       => $default,
					'show_in_rest'  => true,
					'auth_callback' => static fn(): bool => current_user_can( 'edit_posts' ),
				)
			);
		}
	}

	// ---- reading -----------------------------------------------------------

	/** Every stored and computed value the frontend and the admin need. */
	public static function details( int $event_id ): array {
		$m = static fn( string $key ) => get_post_meta( $event_id, $key, true );

		$capacity   = (int) $m( 'vh_capacity' );
		$booked     = Vine_Events_Bookings::confirmed_guests( $event_id );
		$waitlisted = Vine_Events_Bookings::waitlisted_guests( $event_id );
		$highlights = array_values( array_filter( array_map( 'trim', explode( "\n", (string) $m( 'vh_highlights' ) ) ) ) );

		return array(
			'eventDate'          => (string) $m( 'vh_event_date' ),
			'startTime'          => (string) $m( 'vh_start_time' ),
			'endTime'            => (string) $m( 'vh_end_time' ),
			'location'           => (string) $m( 'vh_location' ),
			'room'               => (string) $m( 'vh_room' ),
			'host'               => (string) $m( 'vh_host' ),
			'onlineUrl'          => (string) $m( 'vh_online_url' ),
			'highlights'         => $highlights,
			'bookingEnabled'     => (bool) $m( 'vh_booking_enabled' ),
			'capacity'           => $capacity,
			'maxGuestsPerBooking' => max( 1, (int) $m( 'vh_max_guests' ) ),
			'waitlistEnabled'    => (bool) $m( 'vh_waitlist' ),
			'bookingOpens'       => (string) $m( 'vh_booking_opens' ),
			'bookingCloses'      => (string) $m( 'vh_booking_closes' ),
			'bookedCount'        => $booked,
			'waitlistedCount'    => $waitlisted,
			'remaining'          => $capacity > 0 ? max( 0, $capacity - $booked ) : null,
			'bookingStatus'      => self::booking_status( $event_id, $capacity, $booked ),
		);
	}

	/**
	 * One of: disabled, not_yet_open, closed, full, waitlist, open.
	 * The frontend renders the button from this and nothing else.
	 */
	public static function booking_status( int $event_id, ?int $capacity = null, ?int $booked = null ): string {
		if ( ! get_post_meta( $event_id, 'vh_booking_enabled', true ) ) {
			return 'disabled';
		}
		$now    = current_datetime();
		$opens  = self::parse_local( (string) get_post_meta( $event_id, 'vh_booking_opens', true ) );
		$closes = self::parse_local( (string) get_post_meta( $event_id, 'vh_booking_closes', true ) ) ?? self::start_datetime( $event_id );

		if ( $opens && $now < $opens ) {
			return 'not_yet_open';
		}
		if ( $closes && $now > $closes ) {
			return 'closed';
		}
		$capacity ??= (int) get_post_meta( $event_id, 'vh_capacity', true );
		$booked   ??= Vine_Events_Bookings::confirmed_guests( $event_id );
		if ( $capacity > 0 && $booked >= $capacity ) {
			return get_post_meta( $event_id, 'vh_waitlist', true ) ? 'waitlist' : 'full';
		}
		return 'open';
	}

	public static function start_datetime( int $event_id ): ?DateTimeImmutable {
		$date = (string) get_post_meta( $event_id, 'vh_event_date', true );
		$time = (string) get_post_meta( $event_id, 'vh_start_time', true ) ?: '00:00';
		return $date ? self::parse_local( $date . 'T' . $time ) : null;
	}

	public static function end_datetime( int $event_id ): ?DateTimeImmutable {
		$date = (string) get_post_meta( $event_id, 'vh_event_date', true );
		$time = (string) get_post_meta( $event_id, 'vh_end_time', true );
		if ( ! $date || ! $time ) {
			$start = self::start_datetime( $event_id );
			return $start ? $start->modify( '+90 minutes' ) : null;
		}
		return self::parse_local( $date . 'T' . $time );
	}

	/** "Y-m-d\TH:i" in the site's timezone, or null when empty or malformed. */
	public static function parse_local( string $value ): ?DateTimeImmutable {
		if ( '' === $value ) {
			return null;
		}
		$parsed = DateTimeImmutable::createFromFormat( '!Y-m-d\TH:i', $value, wp_timezone() );
		return $parsed ?: null;
	}

	/** "Sunday, 30 August 2026, 10:00 am – 11:15 am" for emails and admin. */
	public static function when( int $event_id ): string {
		$start = self::start_datetime( $event_id );
		if ( ! $start ) {
			return __( 'Date to be confirmed', 'vine-house-events' );
		}
		$text = wp_date( 'l, j F Y, g:i a', $start->getTimestamp() );
		$end  = get_post_meta( $event_id, 'vh_end_time', true ) ? self::end_datetime( $event_id ) : null;
		if ( $end ) {
			$text .= ' – ' . wp_date( 'g:i a', $end->getTimestamp() );
		}
		return $text;
	}

	/** Upcoming published events, soonest first. */
	public static function upcoming( int $limit = 50 ): array {
		return get_posts(
			array(
				'post_type'      => self::TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => $limit,
				'meta_key'       => 'vh_event_date', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'     => wp_date( 'Y-m-d' ), // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'meta_compare'   => '>=',
				'orderby'        => 'meta_value',
				'order'          => 'ASC',
			)
		);
	}

	// ---- graphql -----------------------------------------------------------

	public static function graphql(): void {
		if ( ! function_exists( 'register_graphql_fields' ) ) {
			return;
		}
		$string = static fn( string $key, string $description ) => array(
			'type'        => 'String',
			'description' => $description,
			'resolve'     => static fn( $event ) => self::details( (int) $event->databaseId )[ $key ],
		);
		$int    = static fn( string $key, string $description ) => array(
			'type'        => 'Int',
			'description' => $description,
			'resolve'     => static fn( $event ) => self::details( (int) $event->databaseId )[ $key ],
		);
		$bool   = static fn( string $key, string $description ) => array(
			'type'        => 'Boolean',
			'description' => $description,
			'resolve'     => static fn( $event ) => self::details( (int) $event->databaseId )[ $key ],
		);

		register_graphql_fields(
			'ChurchEvent',
			array(
				'eventDate'           => $string( 'eventDate', 'Date, YYYY-MM-DD, in the site timezone.' ),
				'startTime'           => $string( 'startTime', 'Start, HH:MM, 24-hour.' ),
				'endTime'             => $string( 'endTime', 'End, HH:MM, 24-hour. Empty when not set.' ),
				'location'            => $string( 'location', 'Venue.' ),
				'room'                => $string( 'room', 'Room within the venue.' ),
				'host'                => $string( 'host', 'Who is hosting.' ),
				'onlineUrl'           => $string( 'onlineUrl', 'Broadcast or meeting link, if any.' ),
				'highlights'          => array(
					'type'        => array( 'list_of' => 'String' ),
					'description' => 'Short bullet points for the card.',
					'resolve'     => static fn( $event ) => self::details( (int) $event->databaseId )['highlights'],
				),
				'bookingEnabled'      => $bool( 'bookingEnabled', 'Whether the event takes bookings at all.' ),
				'capacity'            => $int( 'capacity', 'Total places. 0 means unlimited.' ),
				'maxGuestsPerBooking' => $int( 'maxGuestsPerBooking', 'The most guests one booking may cover.' ),
				'waitlistEnabled'     => $bool( 'waitlistEnabled', 'Whether a full event accepts waitlist bookings.' ),
				'bookingOpens'        => $string( 'bookingOpens', 'When booking opens, YYYY-MM-DDTHH:MM local. Empty means immediately.' ),
				'bookingCloses'       => $string( 'bookingCloses', 'When booking closes. Empty means at the event start.' ),
				'bookedCount'         => $int( 'bookedCount', 'Guests confirmed so far.' ),
				'waitlistedCount'     => $int( 'waitlistedCount', 'Guests on the waitlist.' ),
				'remaining'           => $int( 'remaining', 'Places left, or null when unlimited.' ),
				'bookingStatus'       => $string( 'bookingStatus', 'One of: open, waitlist, full, closed, not_yet_open, disabled.' ),
			)
		);
	}
}
