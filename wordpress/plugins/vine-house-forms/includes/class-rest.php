<?php
/**
 * The endpoints: POST /wp-json/vine/v1/{rsvp|subscribe|enquiry|visit-plan}.
 *
 * Every route requires an authenticated user holding vine_submit_forms —
 * in practice the Next.js route handlers, signing in with an application
 * password. Nothing here is reachable anonymously.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Forms_REST {

	public const NAMESPACE = 'vine/v1';

	/** Per client IP, per route, per minute. */
	private const RATE_LIMIT = 10;

	public static function init(): void {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	public static function routes(): void {
		foreach (
			array(
				'rsvp'       => 'handle_rsvp',
				'subscribe'  => 'handle_subscribe',
				'enquiry'    => 'handle_enquiry',
				'visit-plan' => 'handle_visit_plan',
			) as $route => $handler
		) {
			register_rest_route(
				self::NAMESPACE,
				'/' . $route,
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, $handler ),
					'permission_callback' => array( __CLASS__, 'can_submit' ),
				)
			);
		}
	}

	public static function can_submit(): bool {
		return current_user_can( VINE_FORMS_CAP_SUBMIT );
	}

	// ---- handlers ----------------------------------------------------------

	public static function handle_rsvp( WP_REST_Request $request ) {
		$guard = self::guard( $request, 'rsvp' );
		if ( null !== $guard ) {
			return $guard;
		}
		$data = Vine_Forms_Validation::rsvp( $request->get_json_params() ?: array() );
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$event = get_post( $data['event_id'] );
		if ( ! $event || 'church_event' !== $event->post_type || 'publish' !== $event->post_status ) {
			return new WP_Error( 'vine_forms_no_event', __( 'That event is no longer available.', 'vine-house-forms' ), array( 'status' => 404 ) );
		}

		// Idempotent: the same person confirming the same event again gets
		// their original pass back rather than a second record.
		$existing = self::find_one(
			Vine_Forms_CPT::RSVP,
			array(
				'vh_email'    => $data['email'],
				'vh_event_id' => $data['event_id'],
			)
		);
		if ( $existing ) {
			return self::rsvp_response( $existing, $event, 200 );
		}

		$capacity = (int) get_post_meta( $event->ID, 'capacity', true );
		$taken    = self::rsvp_total( $event->ID );
		if ( $capacity > 0 && $taken + $data['guests_count'] > $capacity ) {
			return new WP_Error(
				'vine_forms_full',
				__( 'There are not enough places left for that many guests.', 'vine-house-forms' ),
				array(
					'status'    => 409,
					'remaining' => max( 0, $capacity - $taken ),
				)
			);
		}

		$post_id = self::store(
			Vine_Forms_CPT::RSVP,
			sprintf( '%s — %s (%d)', $data['name'], $event->post_title, $data['guests_count'] ),
			array(
				'vh_name'        => $data['name'],
				'vh_email'       => $data['email'],
				'vh_phone'       => $data['phone'],
				'vh_event_id'    => $data['event_id'],
				'vh_event_title' => $event->post_title,
				'vh_guests'      => $data['guests_count'],
				'vh_first_time'  => $data['first_time'] ? 1 : 0,
				'vh_notes'       => $data['notes'],
				'vh_pass_code'   => self::pass_code(),
				'vh_checked_in'  => 0,
				'vh_client_ip'   => self::client_ip( $request ),
			)
		);
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}
		Vine_Forms_Notify::send( Vine_Forms_CPT::RSVP, $post_id, $data + array( 'event' => $event->post_title ) );
		return self::rsvp_response( $post_id, $event, 201 );
	}

	public static function handle_subscribe( WP_REST_Request $request ) {
		$guard = self::guard( $request, 'subscribe' );
		if ( null !== $guard ) {
			return $guard;
		}
		$data = Vine_Forms_Validation::subscribe( $request->get_json_params() ?: array() );
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$existing = self::find_one( Vine_Forms_CPT::SUBSCRIBER, array( 'vh_email' => $data['email'] ) );
		if ( $existing ) {
			update_post_meta( $existing, 'vh_frequency', $data['frequency'] );
			return new WP_REST_Response(
				array(
					'id'                => $existing,
					'alreadySubscribed' => true,
				),
				200
			);
		}

		$post_id = self::store(
			Vine_Forms_CPT::SUBSCRIBER,
			$data['email'],
			array(
				'vh_email'     => $data['email'],
				'vh_frequency' => $data['frequency'],
				'vh_client_ip' => self::client_ip( $request ),
			)
		);
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}
		return new WP_REST_Response(
			array(
				'id'                => $post_id,
				'alreadySubscribed' => false,
			),
			201
		);
	}

	public static function handle_enquiry( WP_REST_Request $request ) {
		$guard = self::guard( $request, 'enquiry' );
		if ( null !== $guard ) {
			return $guard;
		}
		$data = Vine_Forms_Validation::enquiry( $request->get_json_params() ?: array() );
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$gathering_title = '';
		if ( $data['gathering_id'] > 0 ) {
			$gathering = get_post( $data['gathering_id'] );
			if ( $gathering && 'gathering' === $gathering->post_type ) {
				$gathering_title = $gathering->post_title;
			}
		}

		$post_id = self::store(
			Vine_Forms_CPT::ENQUIRY,
			sprintf( '%s — %s', $data['name'], ucfirst( $data['category'] ) ),
			array(
				'vh_category'        => $data['category'],
				'vh_name'            => $data['name'],
				'vh_email'           => $data['email'],
				'vh_phone'           => $data['phone'],
				'vh_message'         => $data['message'],
				'vh_source'          => $data['source'],
				'vh_gathering_id'    => $data['gathering_id'],
				'vh_gathering_title' => $gathering_title,
				'vh_client_ip'       => self::client_ip( $request ),
			)
		);
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}
		Vine_Forms_Notify::send( Vine_Forms_CPT::ENQUIRY, $post_id, $data + array( 'gathering' => $gathering_title ) );
		return new WP_REST_Response( array( 'id' => $post_id ), 201 );
	}

	public static function handle_visit_plan( WP_REST_Request $request ) {
		$guard = self::guard( $request, 'visit-plan' );
		if ( null !== $guard ) {
			return $guard;
		}
		$data = Vine_Forms_Validation::visit_plan( $request->get_json_params() ?: array() );
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$pass    = self::pass_code();
		$post_id = self::store(
			Vine_Forms_CPT::VISIT_PLAN,
			sprintf( '%s — %s', $data['name'], $data['service'] ),
			array(
				'vh_name'          => $data['name'],
				'vh_email'         => $data['email'],
				'vh_phone'         => $data['phone'],
				'vh_service'       => $data['service'],
				'vh_visit_date'    => $data['visit_date'],
				'vh_party_size'    => $data['party_size'],
				'vh_children'      => $data['children'] ? 1 : 0,
				'vh_children_ages' => $data['children_ages'],
				'vh_welcome_host'  => $data['welcome_host'] ? 1 : 0,
				'vh_notes'         => $data['notes'],
				'vh_pass_code'     => $pass,
				'vh_client_ip'     => self::client_ip( $request ),
			)
		);
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}
		Vine_Forms_Notify::send( Vine_Forms_CPT::VISIT_PLAN, $post_id, $data );
		return new WP_REST_Response(
			array(
				'id'       => $post_id,
				'passCode' => $pass,
			),
			201
		);
	}

	// ---- shared ------------------------------------------------------------

	/**
	 * Rate limit and honeypot. Returns null to proceed, or a response to send
	 * instead. A tripped honeypot answers with a convincing 201 and stores
	 * nothing, so a bot learns nothing from the reply.
	 */
	private static function guard( WP_REST_Request $request, string $route ): ?WP_REST_Response {
		$params = $request->get_json_params() ?: array();
		if ( ! empty( $params['website'] ) ) {
			return new WP_REST_Response( array( 'id' => 0 ), 201 );
		}

		$key   = 'vine_rl_' . md5( $route . '|' . self::client_ip( $request ) );
		$count = (int) get_transient( $key );
		if ( $count >= self::RATE_LIMIT ) {
			return new WP_REST_Response(
				array( 'message' => __( 'Too many submissions. Please wait a minute and try again.', 'vine-house-forms' ) ),
				429
			);
		}
		set_transient( $key, $count + 1, MINUTE_IN_SECONDS );
		return null;
	}

	/**
	 * Requests arrive from Vercel, so REMOTE_ADDR is a Vercel edge. The
	 * route handler forwards the visitor's address in X-Vine-Client-IP; it is
	 * trusted only because the route itself requires the API user.
	 */
	private static function client_ip( WP_REST_Request $request ): string {
		$header = (string) $request->get_header( 'x_vine_client_ip' );
		$ip     = filter_var( trim( $header ), FILTER_VALIDATE_IP );
		if ( $ip ) {
			return $ip;
		}
		return (string) filter_var( $_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP ) ?: 'unknown';
	}

	/** @return int|WP_Error */
	private static function store( string $type, string $title, array $meta ) {
		$post_id = wp_insert_post(
			array(
				'post_type'   => $type,
				'post_status' => 'publish',
				'post_title'  => wp_strip_all_tags( $title ),
			),
			true
		);
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}
		foreach ( $meta as $key => $value ) {
			update_post_meta( $post_id, $key, $value );
		}
		return $post_id;
	}

	/** First record of $type whose meta matches every pair, or 0. */
	private static function find_one( string $type, array $meta ): int {
		$query = array( 'relation' => 'AND' );
		foreach ( $meta as $key => $value ) {
			$query[] = array(
				'key'   => $key,
				'value' => $value,
			);
		}
		$ids = get_posts(
			array(
				'post_type'      => $type,
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'meta_query'     => $query, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'no_found_rows'  => true,
			)
		);
		return $ids ? (int) $ids[0] : 0;
	}

	/** Guests confirmed against an event. Public: the GraphQL field uses it. */
	public static function rsvp_total( int $event_id ): int {
		$ids = get_posts(
			array(
				'post_type'      => Vine_Forms_CPT::RSVP,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_key'       => 'vh_event_id', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'     => $event_id, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'no_found_rows'  => true,
			)
		);
		$total = 0;
		foreach ( $ids as $id ) {
			$total += (int) get_post_meta( $id, 'vh_guests', true );
		}
		return $total;
	}

	private static function rsvp_response( int $post_id, WP_Post $event, int $status ): WP_REST_Response {
		$capacity = (int) get_post_meta( $event->ID, 'capacity', true );
		$taken    = self::rsvp_total( $event->ID );
		return new WP_REST_Response(
			array(
				'id'         => $post_id,
				'passCode'   => (string) get_post_meta( $post_id, 'vh_pass_code', true ),
				'eventTitle' => $event->post_title,
				'guests'     => (int) get_post_meta( $post_id, 'vh_guests', true ),
				'remaining'  => $capacity > 0 ? max( 0, $capacity - $taken ) : null,
			),
			$status
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
