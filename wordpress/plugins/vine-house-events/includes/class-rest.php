<?php
/**
 * The endpoints the website's route handlers call, under /wp-json/vine/v1/:
 *
 *   GET  /events/{id}/availability
 *   POST /events/{id}/bookings
 *   GET  /bookings/{token}
 *   POST /bookings/{token}/cancel
 *
 * All require an authenticated user holding vine_submit_forms. Nothing is
 * reachable anonymously; the public reads remaining places from GraphQL.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_REST {

	public const NAMESPACE = 'vine/v1';

	/** Per client IP, per minute, for creating bookings. */
	private const RATE_LIMIT = 10;

	public static function init(): void {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	public static function routes(): void {
		$permission = static fn(): bool => current_user_can( VINE_FORMS_CAP_SUBMIT );
		$id_arg     = array(
			'id' => array(
				'validate_callback' => static fn( $v ): bool => is_numeric( $v ) && (int) $v > 0,
			),
		);
		$token_arg  = array(
			'token' => array(
				'validate_callback' => static fn( $v ): bool => is_string( $v ) && 1 === preg_match( '/^[a-f0-9]{32}$/', $v ),
			),
		);

		register_rest_route(
			self::NAMESPACE,
			'/events/(?P<id>\d+)/availability',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'availability' ),
				'permission_callback' => $permission,
				'args'                => $id_arg,
			)
		);
		register_rest_route(
			self::NAMESPACE,
			'/events/(?P<id>\d+)/bookings',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'create' ),
				'permission_callback' => $permission,
				'args'                => $id_arg,
			)
		);
		register_rest_route(
			self::NAMESPACE,
			'/bookings/(?P<token>[a-f0-9]{32})',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'lookup' ),
				'permission_callback' => $permission,
				'args'                => $token_arg,
			)
		);
		register_rest_route(
			self::NAMESPACE,
			'/bookings/(?P<token>[a-f0-9]{32})/cancel',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'cancel' ),
				'permission_callback' => $permission,
				'args'                => $token_arg,
			)
		);
	}

	public static function availability( WP_REST_Request $request ) {
		$event_id = (int) $request['id'];
		$event    = get_post( $event_id );
		if ( ! $event || Vine_Events_Event_Type::TYPE !== $event->post_type || 'publish' !== $event->post_status ) {
			return new WP_Error( 'vine_events_no_event', __( 'That event is no longer available.', 'vine-house-events' ), array( 'status' => 404 ) );
		}
		$d = Vine_Events_Event_Type::details( $event_id );
		return new WP_REST_Response(
			array(
				'id'                  => $event_id,
				'title'               => $event->post_title,
				'bookingStatus'       => $d['bookingStatus'],
				'capacity'            => $d['capacity'],
				'bookedCount'         => $d['bookedCount'],
				'remaining'           => $d['remaining'],
				'waitlistEnabled'     => $d['waitlistEnabled'],
				'maxGuestsPerBooking' => $d['maxGuestsPerBooking'],
			)
		);
	}

	public static function create( WP_REST_Request $request ) {
		$params = $request->get_json_params() ?: array();

		// Honeypot: answer as if it worked, store nothing.
		if ( ! empty( $params['website'] ) ) {
			return new WP_REST_Response( array( 'id' => 0 ), 201 );
		}

		$ip  = self::client_ip( $request );
		$key = 'vine_rl_book_' . md5( $ip );
		$n   = (int) get_transient( $key );
		if ( $n >= self::RATE_LIMIT ) {
			return new WP_Error( 'vine_events_rate_limited', __( 'Too many attempts. Please wait a minute and try again.', 'vine-house-events' ), array( 'status' => 429 ) );
		}
		set_transient( $key, $n + 1, MINUTE_IN_SECONDS );

		$data = Vine_Events_Validation::booking( $params );
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$result = Vine_Events_Bookings::create( (int) $request['id'], $data, 'web', $ip );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		return new WP_REST_Response( $result, $result['existing'] ? 200 : 201 );
	}

	public static function lookup( WP_REST_Request $request ) {
		$booking_id = Vine_Events_Bookings::find_by_token( (string) $request['token'] );
		if ( ! $booking_id ) {
			return new WP_Error( 'vine_events_no_booking', __( 'We could not find that booking.', 'vine-house-events' ), array( 'status' => 404 ) );
		}
		return new WP_REST_Response( Vine_Events_Bookings::payload( $booking_id ) );
	}

	public static function cancel( WP_REST_Request $request ) {
		$result = Vine_Events_Bookings::cancel_by_token( (string) $request['token'] );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		return new WP_REST_Response( $result );
	}

	/**
	 * Requests arrive from Vercel, so REMOTE_ADDR is a Vercel edge. The
	 * route handler forwards the visitor's address in X-Vine-Client-IP,
	 * trusted only because the route itself requires the API user.
	 */
	private static function client_ip( WP_REST_Request $request ): string {
		$ip = filter_var( trim( (string) $request->get_header( 'x_vine_client_ip' ) ), FILTER_VALIDATE_IP );
		if ( $ip ) {
			return $ip;
		}
		return (string) filter_var( $_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP ) ?: 'unknown';
	}
}
