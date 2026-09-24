<?php
/**
 * Plugin Name: Vine House Events
 * Description: Events with bookings for the Vine House Ministries website — capacity, waitlists, pass codes, check-in, attendee emails with calendar files, day-before reminders and CSV export, plus the booking endpoints the site posts to.
 * Version: 0.1.0
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Author: Vine House Ministries
 * License: GPL-2.0-or-later
 * Text Domain: vine-house-events
 */

defined( 'ABSPATH' ) || exit;

define( 'VINE_EVENTS_VERSION', '0.1.0' );
define( 'VINE_EVENTS_DIR', plugin_dir_path( __FILE__ ) );

/** Shared with Vine House Forms: the one capability the website's API user holds. */
if ( ! defined( 'VINE_FORMS_CAP_SUBMIT' ) ) {
	define( 'VINE_FORMS_CAP_SUBMIT', 'vine_submit_forms' );
}

/** Unlocks the bookings screens, manual bookings and exports. */
define( 'VINE_EVENTS_CAP_MANAGE', 'manage_vine_bookings' );

require_once VINE_EVENTS_DIR . 'includes/class-event-type.php';
require_once VINE_EVENTS_DIR . 'includes/class-booking-type.php';
require_once VINE_EVENTS_DIR . 'includes/class-bookings.php';
require_once VINE_EVENTS_DIR . 'includes/class-validation.php';
require_once VINE_EVENTS_DIR . 'includes/class-ics.php';
require_once VINE_EVENTS_DIR . 'includes/class-mail.php';
require_once VINE_EVENTS_DIR . 'includes/class-meta-box.php';
require_once VINE_EVENTS_DIR . 'includes/class-rest.php';
require_once VINE_EVENTS_DIR . 'includes/class-admin.php';
require_once VINE_EVENTS_DIR . 'includes/class-export.php';
require_once VINE_EVENTS_DIR . 'includes/class-cron.php';

Vine_Events_Event_Type::init();
Vine_Events_Booking_Type::init();
Vine_Events_Meta_Box::init();
Vine_Events_REST::init();
Vine_Events_Admin::init();
Vine_Events_Export::init();
Vine_Events_Cron::init();

function vine_events_activate(): void {
	Vine_Events_Event_Type::register();
	Vine_Events_Booking_Type::register();

	// The API-only role. Vine House Forms creates the same role; whichever
	// activates first wins and neither removes it on deactivation.
	if ( ! get_role( 'vine_forms_client' ) ) {
		add_role(
			'vine_forms_client',
			__( 'Vine Forms Client', 'vine-house-events' ),
			array( VINE_FORMS_CAP_SUBMIT => true )
		);
	}

	foreach ( array( 'administrator', 'editor' ) as $role_name ) {
		$role = get_role( $role_name );
		if ( ! $role ) {
			continue;
		}
		$role->add_cap( VINE_EVENTS_CAP_MANAGE );
		foreach ( Vine_Events_Booking_Type::management_caps() as $cap ) {
			$role->add_cap( $cap );
		}
	}

	foreach ( array( 'Worship', 'Fellowship', 'Outreach', 'Study', 'Youth' ) as $category ) {
		if ( ! term_exists( $category, Vine_Events_Event_Type::TAXONOMY ) ) {
			wp_insert_term( $category, Vine_Events_Event_Type::TAXONOMY );
		}
	}

	Vine_Events_Cron::schedule();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'vine_events_activate' );

function vine_events_deactivate(): void {
	Vine_Events_Cron::unschedule();
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'vine_events_deactivate' );
