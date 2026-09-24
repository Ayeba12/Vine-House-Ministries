<?php
/**
 * The booking record type. Private in every sense: not public, not
 * queryable, not in REST or GraphQL. It lives under the Events menu, and
 * "Add New" is disabled — bookings arrive through the endpoints or the
 * office's Add Booking screen.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Booking_Type {

	public const TYPE = 'vh_booking';

	public const CONFIRMED  = 'confirmed';
	public const WAITLISTED = 'waitlisted';
	public const CANCELLED  = 'cancelled';

	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	public static function statuses(): array {
		return array(
			self::CONFIRMED  => __( 'Confirmed', 'vine-house-events' ),
			self::WAITLISTED => __( 'Waitlisted', 'vine-house-events' ),
			self::CANCELLED  => __( 'Cancelled', 'vine-house-events' ),
		);
	}

	public static function register(): void {
		register_post_type(
			self::TYPE,
			array(
				'label'               => __( 'Bookings', 'vine-house-events' ),
				'labels'              => array(
					'name'          => __( 'Bookings', 'vine-house-events' ),
					'singular_name' => __( 'Booking', 'vine-house-events' ),
					'edit_item'     => __( 'Booking', 'vine-house-events' ),
					'search_items'  => __( 'Search bookings', 'vine-house-events' ),
					'not_found'     => __( 'No bookings yet.', 'vine-house-events' ),
					'all_items'     => __( 'Bookings', 'vine-house-events' ),
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'exclude_from_search' => true,
				'show_ui'             => true,
				'show_in_menu'        => 'edit.php?post_type=' . Vine_Events_Event_Type::TYPE,
				'show_in_rest'        => false,
				'show_in_graphql'     => false,
				'has_archive'         => false,
				'rewrite'             => false,
				'query_var'           => false,
				'supports'            => array( 'title' ),
				'capability_type'     => 'vine_booking',
				'map_meta_cap'        => true,
				'capabilities'        => array(
					'create_posts' => 'do_not_allow',
				),
			)
		);
	}

	/** @return string[] the primitives map_meta_cap resolves to */
	public static function management_caps(): array {
		return array(
			'edit_vine_bookings',
			'edit_others_vine_bookings',
			'edit_private_vine_bookings',
			'edit_published_vine_bookings',
			'publish_vine_bookings',
			'read_private_vine_bookings',
			'delete_vine_bookings',
			'delete_others_vine_bookings',
			'delete_private_vine_bookings',
			'delete_published_vine_bookings',
		);
	}
}
