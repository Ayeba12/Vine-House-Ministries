<?php
/**
 * The endpoints: POST /wp-json/vine/v1/{subscribe|enquiry|visit-plan}.
 *
 * Every route requires an authenticated user holding vine_submit_forms —
 * in practice the Next.js route handlers, signing in with an application
 * password. Nothing here is reachable anonymously. Event bookings are
 * handled by Vine House Events under the same namespace.
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
