<?php
/**
 * Plugin Name: Vine House Forms
 * Description: Receives the website's RSVPs, newsletter sign-ups, enquiries and visit plans through authenticated REST endpoints, and keeps them as private records the church office can manage and export.
 * Version: 0.1.0
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Author: Vine House Ministries
 * License: GPL-2.0-or-later
 * Text Domain: vine-house-forms
 */

defined( 'ABSPATH' ) || exit;

define( 'VINE_FORMS_VERSION', '0.1.0' );
define( 'VINE_FORMS_DIR', plugin_dir_path( __FILE__ ) );

/** The one capability the website's API user holds. */
define( 'VINE_FORMS_CAP_SUBMIT', 'vine_submit_forms' );

/** The capability that unlocks the admin screens and exports. */
define( 'VINE_FORMS_CAP_MANAGE', 'manage_vine_submissions' );

require_once VINE_FORMS_DIR . 'includes/class-cpt.php';
require_once VINE_FORMS_DIR . 'includes/class-validation.php';
require_once VINE_FORMS_DIR . 'includes/class-notify.php';
require_once VINE_FORMS_DIR . 'includes/class-rest.php';
require_once VINE_FORMS_DIR . 'includes/class-admin.php';
require_once VINE_FORMS_DIR . 'includes/class-export.php';

Vine_Forms_CPT::init();
Vine_Forms_REST::init();
Vine_Forms_Admin::init();
Vine_Forms_Export::init();

/**
 * Activation: register the types, create the API-only role, and hand the
 * submission capabilities to the roles that run the church office.
 */
function vine_forms_activate(): void {
	Vine_Forms_CPT::register();

	// A role that can submit and nothing else. The application password the
	// Next.js route handlers use belongs to a user in this role.
	add_role(
		'vine_forms_client',
		__( 'Vine Forms Client', 'vine-house-forms' ),
		array( VINE_FORMS_CAP_SUBMIT => true )
	);

	foreach ( array( 'administrator', 'editor' ) as $role_name ) {
		$role = get_role( $role_name );
		if ( ! $role ) {
			continue;
		}
		$role->add_cap( VINE_FORMS_CAP_MANAGE );
		foreach ( Vine_Forms_CPT::management_caps() as $cap ) {
			$role->add_cap( $cap );
		}
	}

	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'vine_forms_activate' );

function vine_forms_deactivate(): void {
	remove_role( 'vine_forms_client' );
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'vine_forms_deactivate' );

/**
 * Expose the live RSVP total on the Event type so the frontend can show
 * "26 seats available" from the same source that enforces the limit.
 * Only the aggregate crosses the boundary; the records stay private.
 */
add_action(
	'graphql_register_types',
	function (): void {
		if ( ! function_exists( 'register_graphql_field' ) ) {
			return;
		}
		register_graphql_field(
			'ChurchEvent',
			'rsvpCount',
			array(
				'type'        => 'Int',
				'description' => __( 'Guests confirmed against this event.', 'vine-house-forms' ),
				'resolve'     => static function ( $event ): int {
					return Vine_Forms_REST::rsvp_total( (int) $event->databaseId );
				},
			)
		);
	}
);
