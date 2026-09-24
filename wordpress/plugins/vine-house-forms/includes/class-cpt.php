<?php
/**
 * The four submission types.
 *
 * Every one is private in every sense WordPress offers: not public, not
 * queryable, not in the REST index, not in GraphQL, not searchable. They
 * exist to be listed in wp-admin and exported, nothing more. Records are
 * created only through the plugin's own endpoints, so the UI's "Add New"
 * is disabled outright.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Forms_CPT {

	public const RSVP       = 'vh_rsvp';
	public const SUBSCRIBER = 'vh_subscriber';
	public const ENQUIRY    = 'vh_enquiry';
	public const VISIT_PLAN = 'vh_visit_plan';

	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	/** @return array<string, array{singular: string, plural: string}> */
	public static function types(): array {
		return array(
			self::RSVP       => array(
				'singular' => __( 'RSVP', 'vine-house-forms' ),
				'plural'   => __( 'RSVPs', 'vine-house-forms' ),
			),
			self::SUBSCRIBER => array(
				'singular' => __( 'Subscriber', 'vine-house-forms' ),
				'plural'   => __( 'Subscribers', 'vine-house-forms' ),
			),
			self::ENQUIRY    => array(
				'singular' => __( 'Enquiry', 'vine-house-forms' ),
				'plural'   => __( 'Enquiries', 'vine-house-forms' ),
			),
			self::VISIT_PLAN => array(
				'singular' => __( 'Visit plan', 'vine-house-forms' ),
				'plural'   => __( 'Visit plans', 'vine-house-forms' ),
			),
		);
	}

	public static function register(): void {
		foreach ( self::types() as $type => $labels ) {
			register_post_type(
				$type,
				array(
					'label'               => $labels['plural'],
					'labels'              => array(
						'name'          => $labels['plural'],
						'singular_name' => $labels['singular'],
						'edit_item'     => $labels['singular'],
						'search_items'  => sprintf( /* translators: %s: plural label */ __( 'Search %s', 'vine-house-forms' ), $labels['plural'] ),
						'not_found'     => __( 'Nothing received yet.', 'vine-house-forms' ),
					),
					'public'              => false,
					'publicly_queryable'  => false,
					'exclude_from_search' => true,
					'show_ui'             => true,
					'show_in_menu'        => Vine_Forms_Admin::MENU,
					'show_in_rest'        => false,
					'show_in_graphql'     => false,
					'has_archive'         => false,
					'rewrite'             => false,
					'query_var'           => false,
					'supports'            => array( 'title' ),
					'capability_type'     => 'vine_submission',
					'map_meta_cap'        => true,
					'capabilities'        => array(
						'create_posts' => 'do_not_allow',
					),
				)
			);
		}
	}

	/**
	 * The primitive capabilities map_meta_cap resolves the submission types
	 * to. Granted to administrators and editors on activation.
	 *
	 * @return string[]
	 */
	public static function management_caps(): array {
		return array(
			'edit_vine_submissions',
			'edit_others_vine_submissions',
			'edit_private_vine_submissions',
			'edit_published_vine_submissions',
			'publish_vine_submissions',
			'read_private_vine_submissions',
			'delete_vine_submissions',
			'delete_others_vine_submissions',
			'delete_private_vine_submissions',
			'delete_published_vine_submissions',
		);
	}
}
