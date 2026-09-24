<?php
/**
 * The wp-admin side: one "Vine Forms" menu holding the four record types,
 * useful list columns, a check-in toggle for RSVPs, and the notification
 * address setting.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Forms_Admin {

	public const MENU = 'vine-house-forms';

	public static function init(): void {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'settings' ) );
		add_action( 'admin_post_vine_forms_checkin', array( __CLASS__, 'toggle_checkin' ) );

		foreach ( array_keys( Vine_Forms_CPT::types() ) as $type ) {
			add_filter( "manage_{$type}_posts_columns", array( __CLASS__, 'columns' ) );
			add_action( "manage_{$type}_posts_custom_column", array( __CLASS__, 'column' ), 10, 2 );
		}
		add_filter( 'post_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'manage_posts_extra_tablenav', array( __CLASS__, 'export_button' ) );
	}

	public static function menu(): void {
		add_menu_page(
			__( 'Vine Forms', 'vine-house-forms' ),
			__( 'Vine Forms', 'vine-house-forms' ),
			VINE_FORMS_CAP_MANAGE,
			self::MENU,
			array( __CLASS__, 'dashboard' ),
			'dashicons-feedback',
			26
		);
	}

	public static function dashboard(): void {
		if ( ! current_user_can( VINE_FORMS_CAP_MANAGE ) ) {
			wp_die( esc_html__( 'You do not have permission to view this page.', 'vine-house-forms' ) );
		}
		echo '<div class="wrap"><h1>' . esc_html__( 'Vine Forms', 'vine-house-forms' ) . '</h1>';
		echo '<table class="widefat striped" style="max-width:520px;margin:1em 0"><tbody>';
		foreach ( Vine_Forms_CPT::types() as $type => $labels ) {
			$count = (int) wp_count_posts( $type )->publish;
			printf(
				'<tr><td><a href="%s">%s</a></td><td style="text-align:right">%d</td></tr>',
				esc_url( admin_url( 'edit.php?post_type=' . $type ) ),
				esc_html( $labels['plural'] ),
				$count
			);
		}
		echo '</tbody></table>';

		echo '<form method="post" action="options.php">';
		settings_fields( 'vine_forms' );
		do_settings_sections( self::MENU );
		submit_button();
		echo '</form></div>';
	}

	public static function settings(): void {
		register_setting(
			'vine_forms',
			Vine_Forms_Notify::OPTION,
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_email',
				'default'           => '',
			)
		);
		add_settings_section( 'vine_forms_notify', __( 'Notifications', 'vine-house-forms' ), '__return_false', self::MENU );
		add_settings_field(
			Vine_Forms_Notify::OPTION,
			__( 'Send new submissions to', 'vine-house-forms' ),
			static function (): void {
				printf(
					'<input type="email" class="regular-text" name="%1$s" value="%2$s" placeholder="%3$s">',
					esc_attr( Vine_Forms_Notify::OPTION ),
					esc_attr( (string) get_option( Vine_Forms_Notify::OPTION, '' ) ),
					esc_attr( (string) get_option( 'admin_email' ) )
				);
			},
			self::MENU,
			'vine_forms_notify'
		);
	}

	// ---- list tables -------------------------------------------------------

	/** @param array<string, string> $columns */
	public static function columns( array $columns ): array {
		$type = get_current_screen()->post_type ?? '';
		$out  = array(
			'cb'    => $columns['cb'] ?? '',
			'title' => $columns['title'] ?? __( 'Name', 'vine-house-forms' ),
		);
		foreach ( self::column_map( $type ) as $key => $label ) {
			$out[ $key ] = $label;
		}
		$out['date'] = __( 'Received', 'vine-house-forms' );
		return $out;
	}

	public static function column( string $column, int $post_id ): void {
		if ( 'vh_checked_in' === $column ) {
			echo get_post_meta( $post_id, 'vh_checked_in', true ) ? '&#10003; ' . esc_html__( 'In', 'vine-house-forms' ) : '&mdash;';
			return;
		}
		if ( in_array( $column, array( 'vh_first_time', 'vh_children', 'vh_welcome_host' ), true ) ) {
			echo get_post_meta( $post_id, $column, true ) ? esc_html__( 'Yes', 'vine-house-forms' ) : '&mdash;';
			return;
		}
		if ( 'vh_email' === $column ) {
			$email = (string) get_post_meta( $post_id, 'vh_email', true );
			printf( '<a href="mailto:%1$s">%1$s</a>', esc_attr( $email ) );
			return;
		}
		if ( 'vh_message' === $column ) {
			echo esc_html( wp_trim_words( (string) get_post_meta( $post_id, 'vh_message', true ), 14 ) );
			return;
		}
		if ( 0 === strpos( $column, 'vh_' ) ) {
			echo esc_html( (string) get_post_meta( $post_id, $column, true ) );
		}
	}

	/** @param array<string, string> $actions */
	public static function row_actions( array $actions, WP_Post $post ): array {
		if ( Vine_Forms_CPT::RSVP !== $post->post_type ) {
			return $actions;
		}
		$checked = (bool) get_post_meta( $post->ID, 'vh_checked_in', true );
		$url     = wp_nonce_url(
			admin_url( 'admin-post.php?action=vine_forms_checkin&post=' . $post->ID ),
			'vine_forms_checkin_' . $post->ID
		);
		$actions['vine_checkin'] = sprintf(
			'<a href="%s">%s</a>',
			esc_url( $url ),
			$checked ? esc_html__( 'Undo check-in', 'vine-house-forms' ) : esc_html__( 'Check in', 'vine-house-forms' )
		);
		return $actions;
	}

	public static function toggle_checkin(): void {
		$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
		check_admin_referer( 'vine_forms_checkin_' . $post_id );
		if ( ! current_user_can( VINE_FORMS_CAP_MANAGE ) || Vine_Forms_CPT::RSVP !== get_post_type( $post_id ) ) {
			wp_die( esc_html__( 'You do not have permission to do that.', 'vine-house-forms' ) );
		}
		update_post_meta( $post_id, 'vh_checked_in', get_post_meta( $post_id, 'vh_checked_in', true ) ? 0 : 1 );
		wp_safe_redirect( wp_get_referer() ?: admin_url( 'edit.php?post_type=' . Vine_Forms_CPT::RSVP ) );
		exit;
	}

	public static function export_button( string $which ): void {
		$type = get_current_screen()->post_type ?? '';
		if ( 'top' !== $which || ! isset( Vine_Forms_CPT::types()[ $type ] ) || ! current_user_can( VINE_FORMS_CAP_MANAGE ) ) {
			return;
		}
		$url = wp_nonce_url(
			admin_url( 'admin-post.php?action=vine_forms_export&type=' . $type ),
			'vine_forms_export_' . $type
		);
		printf(
			'<div class="alignleft actions"><a class="button" href="%s">%s</a></div>',
			esc_url( $url ),
			esc_html__( 'Export CSV', 'vine-house-forms' )
		);
	}

	/** @return array<string, string> meta key => column label */
	public static function column_map( string $type ): array {
		switch ( $type ) {
			case Vine_Forms_CPT::RSVP:
				return array(
					'vh_event_title' => __( 'Event', 'vine-house-forms' ),
					'vh_email'       => __( 'Email', 'vine-house-forms' ),
					'vh_guests'      => __( 'Guests', 'vine-house-forms' ),
					'vh_first_time'  => __( 'First visit', 'vine-house-forms' ),
					'vh_pass_code'   => __( 'Pass', 'vine-house-forms' ),
					'vh_checked_in'  => __( 'Checked in', 'vine-house-forms' ),
				);
			case Vine_Forms_CPT::SUBSCRIBER:
				return array(
					'vh_frequency' => __( 'Frequency', 'vine-house-forms' ),
				);
			case Vine_Forms_CPT::ENQUIRY:
				return array(
					'vh_category' => __( 'Category', 'vine-house-forms' ),
					'vh_email'    => __( 'Email', 'vine-house-forms' ),
					'vh_message'  => __( 'Message', 'vine-house-forms' ),
					'vh_gathering_title' => __( 'Gathering', 'vine-house-forms' ),
				);
			case Vine_Forms_CPT::VISIT_PLAN:
				return array(
					'vh_service'      => __( 'Service', 'vine-house-forms' ),
					'vh_visit_date'   => __( 'Date', 'vine-house-forms' ),
					'vh_email'        => __( 'Email', 'vine-house-forms' ),
					'vh_party_size'   => __( 'Party', 'vine-house-forms' ),
					'vh_children'     => __( 'Children', 'vine-house-forms' ),
					'vh_welcome_host' => __( 'Host', 'vine-house-forms' ),
					'vh_pass_code'    => __( 'Pass', 'vine-house-forms' ),
				);
		}
		return array();
	}
}
