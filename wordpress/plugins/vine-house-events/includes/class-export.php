<?php
/**
 * CSV export: one event's attendee list, or every booking. Streams to the
 * browser; nothing touches the server's disk.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Export {

	public static function init(): void {
		add_action( 'admin_post_vine_events_export', array( __CLASS__, 'export' ) );
	}

	public static function export(): void {
		check_admin_referer( 'vine_events_export' );
		if ( ! current_user_can( VINE_EVENTS_CAP_MANAGE ) ) {
			wp_die( esc_html__( 'You do not have permission to do that.', 'vine-house-events' ) );
		}
		$event_id = isset( $_GET['event'] ) ? (int) $_GET['event'] : 0;

		$ids = $event_id
			? Vine_Events_Bookings::ids_for_event( $event_id )
			: get_posts(
				array(
					'post_type'      => Vine_Events_Booking_Type::TYPE,
					'post_status'    => 'publish',
					'posts_per_page' => -1,
					'fields'         => 'ids',
					'orderby'        => 'date',
					'order'          => 'DESC',
					'no_found_rows'  => true,
				)
			);

		$name = $event_id ? sanitize_title( get_the_title( $event_id ) ) : 'all-bookings';

		nocache_headers();
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'X-Content-Type-Options: nosniff' );
		header( sprintf( 'Content-Disposition: attachment; filename="bookings-%s-%s.csv"', $name, gmdate( 'Y-m-d' ) ) );

		$out = fopen( 'php://output', 'w' );
		fwrite( $out, "\xEF\xBB\xBF" ); // BOM so Excel reads UTF-8.
		fputcsv( $out, array( 'Booked', 'Event', 'Event date', 'Name', 'Email', 'Phone', 'Guests', 'Status', 'Pass code', 'Checked in', 'First visit', 'Source', 'Notes' ) );

		foreach ( $ids as $id ) {
			$ev  = (int) get_post_meta( $id, 'vh_event_id', true );
			$row = array(
				get_the_date( 'Y-m-d H:i', $id ),
				get_the_title( $ev ),
				get_post_meta( $ev, 'vh_event_date', true ),
				get_post_meta( $id, 'vh_name', true ),
				get_post_meta( $id, 'vh_email', true ),
				get_post_meta( $id, 'vh_phone', true ),
				(int) get_post_meta( $id, 'vh_guests', true ),
				get_post_meta( $id, 'vh_status', true ),
				get_post_meta( $id, 'vh_pass_code', true ),
				get_post_meta( $id, 'vh_checked_in', true ) ? 'yes' : 'no',
				get_post_meta( $id, 'vh_first_time', true ) ? 'yes' : 'no',
				get_post_meta( $id, 'vh_source', true ),
				get_post_meta( $id, 'vh_notes', true ),
			);
			// Neutralise spreadsheet formula injection from user-typed cells.
			foreach ( $row as $i => $value ) {
				if ( is_string( $value ) && preg_match( '/^[=+\-@]/', $value ) ) {
					$row[ $i ] = "'" . $value;
				}
			}
			fputcsv( $out, $row );
		}
		fclose( $out ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose
		exit;
	}
}
