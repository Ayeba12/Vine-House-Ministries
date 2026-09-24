<?php
/**
 * CSV export of any submission type, for the office to open in Excel or
 * hand to a mailing tool. Streams straight to the browser; nothing is
 * written to disk on the server.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Forms_Export {

	public static function init(): void {
		add_action( 'admin_post_vine_forms_export', array( __CLASS__, 'export' ) );
	}

	public static function export(): void {
		$type = isset( $_GET['type'] ) ? sanitize_key( (string) $_GET['type'] ) : '';
		check_admin_referer( 'vine_forms_export_' . $type );
		if ( ! current_user_can( VINE_FORMS_CAP_MANAGE ) || ! isset( Vine_Forms_CPT::types()[ $type ] ) ) {
			wp_die( esc_html__( 'You do not have permission to do that.', 'vine-house-forms' ) );
		}

		$fields = self::fields( $type );
		$ids    = get_posts(
			array(
				'post_type'      => $type,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'orderby'        => 'date',
				'order'          => 'DESC',
				'no_found_rows'  => true,
			)
		);

		nocache_headers();
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'X-Content-Type-Options: nosniff' );
		header( sprintf( 'Content-Disposition: attachment; filename="%s-%s.csv"', $type, gmdate( 'Y-m-d' ) ) );

		$out = fopen( 'php://output', 'w' );
		// BOM so Excel reads the UTF-8 (names with accents, the en dash in titles).
		fwrite( $out, "\xEF\xBB\xBF" );
		fputcsv( $out, array_merge( array( 'Received', 'Title' ), array_values( $fields ) ) );

		foreach ( $ids as $id ) {
			$row = array( get_the_date( 'Y-m-d H:i', $id ), get_the_title( $id ) );
			foreach ( array_keys( $fields ) as $key ) {
				$value = get_post_meta( $id, $key, true );
				if ( in_array( $key, array( 'vh_children', 'vh_welcome_host' ), true ) ) {
					$value = $value ? 'yes' : 'no';
				}
				// Neutralise spreadsheet formula injection from user-typed cells.
				if ( is_string( $value ) && preg_match( '/^[=+\-@]/', $value ) ) {
					$value = "'" . $value;
				}
				$row[] = $value;
			}
			fputcsv( $out, $row );
		}
		fclose( $out ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose
		exit;
	}

	/** @return array<string, string> meta key => header */
	private static function fields( string $type ): array {
		switch ( $type ) {
			case Vine_Forms_CPT::SUBSCRIBER:
				return array(
					'vh_email'     => 'Email',
					'vh_frequency' => 'Frequency',
				);
			case Vine_Forms_CPT::ENQUIRY:
				return array(
					'vh_category'        => 'Category',
					'vh_name'            => 'Name',
					'vh_email'           => 'Email',
					'vh_phone'           => 'Phone',
					'vh_message'         => 'Message',
					'vh_source'          => 'Source',
					'vh_gathering_title' => 'Gathering',
				);
			case Vine_Forms_CPT::VISIT_PLAN:
				return array(
					'vh_name'          => 'Name',
					'vh_email'         => 'Email',
					'vh_phone'         => 'Phone',
					'vh_service'       => 'Service',
					'vh_visit_date'    => 'Date',
					'vh_party_size'    => 'Party size',
					'vh_children'      => 'Children',
					'vh_children_ages' => 'Children ages',
					'vh_welcome_host'  => 'Welcome host',
					'vh_notes'         => 'Notes',
					'vh_pass_code'     => 'Pass code',
				);
		}
		return array();
	}
}
