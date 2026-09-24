<?php
/**
 * Day-before reminders. A daily WP-Cron task finds tomorrow's events and
 * emails every confirmed guest who has not already been reminded.
 *
 * WP-Cron fires on page views; a headless WordPress gets few of those. On
 * Bluehost, disable WP-Cron and call wp-cron.php from a real cron entry
 * every fifteen minutes so this runs on time.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Cron {

	public const HOOK = 'vine_events_daily';

	public static function init(): void {
		add_action( self::HOOK, array( __CLASS__, 'run' ) );
	}

	public static function schedule(): void {
		if ( ! wp_next_scheduled( self::HOOK ) ) {
			// 9am site time, tomorrow, then daily.
			$first = ( new DateTimeImmutable( 'tomorrow 09:00', wp_timezone() ) )->getTimestamp();
			wp_schedule_event( $first, 'daily', self::HOOK );
		}
	}

	public static function unschedule(): void {
		$next = wp_next_scheduled( self::HOOK );
		if ( $next ) {
			wp_unschedule_event( $next, self::HOOK );
		}
	}

	public static function run(): void {
		if ( ! get_option( Vine_Events_Mail::OPTION_REMINDERS, true ) ) {
			return;
		}
		$tomorrow = wp_date( 'Y-m-d', ( new DateTimeImmutable( 'tomorrow', wp_timezone() ) )->getTimestamp() );
		$events   = get_posts(
			array(
				'post_type'      => Vine_Events_Event_Type::TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_key'       => 'vh_event_date', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'     => $tomorrow, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'no_found_rows'  => true,
			)
		);
		foreach ( $events as $event_id ) {
			foreach ( Vine_Events_Bookings::ids_for_event( (int) $event_id, Vine_Events_Booking_Type::CONFIRMED ) as $booking_id ) {
				if ( get_post_meta( $booking_id, 'vh_reminded', true ) ) {
					continue;
				}
				Vine_Events_Mail::reminder( $booking_id );
				update_post_meta( $booking_id, 'vh_reminded', 1 );
			}
		}
	}
}
