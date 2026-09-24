<?php
/**
 * wp-admin: the bookings list with its filters and row actions, the event
 * list's booking column, the office's Add Booking screen, and settings.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Admin {

	private const PAGE_ADD      = 'vine-events-add';
	private const PAGE_SETTINGS = 'vine-events-settings';

	public static function init(): void {
		$booking = Vine_Events_Booking_Type::TYPE;
		$event   = Vine_Events_Event_Type::TYPE;

		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'settings' ) );
		add_action( 'admin_notices', array( __CLASS__, 'notices' ) );

		add_filter( "manage_{$booking}_posts_columns", array( __CLASS__, 'booking_columns' ) );
		add_action( "manage_{$booking}_posts_custom_column", array( __CLASS__, 'booking_column' ), 10, 2 );
		add_filter( 'post_row_actions', array( __CLASS__, 'booking_row_actions' ), 10, 2 );
		add_action( 'restrict_manage_posts', array( __CLASS__, 'booking_filters' ) );
		add_action( 'pre_get_posts', array( __CLASS__, 'apply_booking_filters' ) );
		add_action( 'manage_posts_extra_tablenav', array( __CLASS__, 'export_button' ) );

		add_filter( "manage_{$event}_posts_columns", array( __CLASS__, 'event_columns' ) );
		add_action( "manage_{$event}_posts_custom_column", array( __CLASS__, 'event_column' ), 10, 2 );

		add_action( 'admin_post_vine_events_checkin', array( __CLASS__, 'toggle_checkin' ) );
		add_action( 'admin_post_vine_events_cancel', array( __CLASS__, 'cancel_booking' ) );
		add_action( 'admin_post_vine_events_add', array( __CLASS__, 'handle_add' ) );
	}

	public static function menu(): void {
		$parent = 'edit.php?post_type=' . Vine_Events_Event_Type::TYPE;
		add_submenu_page( $parent, __( 'Add Booking', 'vine-house-events' ), __( 'Add Booking', 'vine-house-events' ), VINE_EVENTS_CAP_MANAGE, self::PAGE_ADD, array( __CLASS__, 'render_add' ) );
		add_submenu_page( $parent, __( 'Booking Settings', 'vine-house-events' ), __( 'Settings', 'vine-house-events' ), 'manage_options', self::PAGE_SETTINGS, array( __CLASS__, 'render_settings' ) );
	}

	// ---- bookings list -----------------------------------------------------

	/** @param array<string, string> $columns */
	public static function booking_columns( array $columns ): array {
		return array(
			'cb'            => $columns['cb'] ?? '',
			'title'         => __( 'Name', 'vine-house-events' ),
			'vh_event'      => __( 'Event', 'vine-house-events' ),
			'vh_email'      => __( 'Email', 'vine-house-events' ),
			'vh_guests'     => __( 'Guests', 'vine-house-events' ),
			'vh_status'     => __( 'Status', 'vine-house-events' ),
			'vh_pass_code'  => __( 'Pass', 'vine-house-events' ),
			'vh_checked_in' => __( 'Checked in', 'vine-house-events' ),
			'vh_source'     => __( 'Source', 'vine-house-events' ),
			'date'          => __( 'Booked', 'vine-house-events' ),
		);
	}

	public static function booking_column( string $column, int $post_id ): void {
		switch ( $column ) {
			case 'vh_event':
				$event_id = (int) get_post_meta( $post_id, 'vh_event_id', true );
				printf(
					'<a href="%s">%s</a><br><span style="color:#646970">%s</span>',
					esc_url( get_edit_post_link( $event_id ) ?: '#' ),
					esc_html( get_the_title( $event_id ) ),
					esc_html( (string) get_post_meta( $event_id, 'vh_event_date', true ) )
				);
				break;
			case 'vh_email':
				$email = (string) get_post_meta( $post_id, 'vh_email', true );
				printf( '<a href="mailto:%1$s">%1$s</a>', esc_attr( $email ) );
				break;
			case 'vh_status':
				$status = (string) get_post_meta( $post_id, 'vh_status', true );
				$colors = array(
					Vine_Events_Booking_Type::CONFIRMED  => '#00a32a',
					Vine_Events_Booking_Type::WAITLISTED => '#dba617',
					Vine_Events_Booking_Type::CANCELLED  => '#8c8f94',
				);
				printf(
					'<span style="display:inline-block;padding:2px 8px;border-radius:3px;color:#fff;background:%s">%s</span>',
					esc_attr( $colors[ $status ] ?? '#8c8f94' ),
					esc_html( Vine_Events_Booking_Type::statuses()[ $status ] ?? $status )
				);
				break;
			case 'vh_checked_in':
				echo get_post_meta( $post_id, 'vh_checked_in', true ) ? '&#10003;' : '&mdash;';
				break;
			default:
				echo esc_html( (string) get_post_meta( $post_id, $column, true ) );
		}
	}

	/** @param array<string, string> $actions */
	public static function booking_row_actions( array $actions, WP_Post $post ): array {
		if ( Vine_Events_Booking_Type::TYPE !== $post->post_type || ! current_user_can( VINE_EVENTS_CAP_MANAGE ) ) {
			return $actions;
		}
		unset( $actions['inline hide-if-no-js'] );
		$status = (string) get_post_meta( $post->ID, 'vh_status', true );

		if ( Vine_Events_Booking_Type::CONFIRMED === $status ) {
			$checked = (bool) get_post_meta( $post->ID, 'vh_checked_in', true );
			$actions['vine_checkin'] = sprintf(
				'<a href="%s">%s</a>',
				esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=vine_events_checkin&booking=' . $post->ID ), 'vine_events_checkin_' . $post->ID ) ),
				$checked ? esc_html__( 'Undo check-in', 'vine-house-events' ) : esc_html__( 'Check in', 'vine-house-events' )
			);
		}
		if ( Vine_Events_Booking_Type::CANCELLED !== $status ) {
			$actions['vine_cancel'] = sprintf(
				'<a href="%s" style="color:#b32d2e" onclick="return confirm(%s)">%s</a>',
				esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=vine_events_cancel&booking=' . $post->ID ), 'vine_events_cancel_' . $post->ID ) ),
				esc_attr( wp_json_encode( __( 'Cancel this booking and email the guest?', 'vine-house-events' ) ) ),
				esc_html__( 'Cancel booking', 'vine-house-events' )
			);
		}
		return $actions;
	}

	public static function booking_filters( string $post_type ): void {
		if ( Vine_Events_Booking_Type::TYPE !== $post_type ) {
			return;
		}
		$current_event  = isset( $_GET['vh_event'] ) ? (int) $_GET['vh_event'] : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$current_status = isset( $_GET['vh_status'] ) ? sanitize_key( (string) $_GET['vh_status'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		$events = get_posts(
			array(
				'post_type'      => Vine_Events_Event_Type::TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => 100,
				'meta_key'       => 'vh_event_date', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'orderby'        => 'meta_value',
				'order'          => 'DESC',
			)
		);
		echo '<select name="vh_event"><option value="">' . esc_html__( 'All events', 'vine-house-events' ) . '</option>';
		foreach ( $events as $event ) {
			printf(
				'<option value="%d" %s>%s — %s</option>',
				(int) $event->ID,
				selected( $current_event, $event->ID, false ),
				esc_html( (string) get_post_meta( $event->ID, 'vh_event_date', true ) ),
				esc_html( $event->post_title )
			);
		}
		echo '</select>';

		echo '<select name="vh_status"><option value="">' . esc_html__( 'All statuses', 'vine-house-events' ) . '</option>';
		foreach ( Vine_Events_Booking_Type::statuses() as $key => $label ) {
			printf( '<option value="%s" %s>%s</option>', esc_attr( $key ), selected( $current_status, $key, false ), esc_html( $label ) );
		}
		echo '</select>';
	}

	public static function apply_booking_filters( WP_Query $query ): void {
		if ( ! is_admin() || ! $query->is_main_query() || Vine_Events_Booking_Type::TYPE !== $query->get( 'post_type' ) ) {
			return;
		}
		$meta = array();
		if ( ! empty( $_GET['vh_event'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$meta[] = array(
				'key'   => 'vh_event_id',
				'value' => (int) $_GET['vh_event'], // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			);
		}
		if ( ! empty( $_GET['vh_status'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$meta[] = array(
				'key'   => 'vh_status',
				'value' => sanitize_key( (string) $_GET['vh_status'] ), // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			);
		}
		if ( $meta ) {
			$query->set( 'meta_query', $meta ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
		}
	}

	public static function export_button( string $which ): void {
		$screen = get_current_screen();
		if ( 'top' !== $which || ! $screen || Vine_Events_Booking_Type::TYPE !== $screen->post_type || ! current_user_can( VINE_EVENTS_CAP_MANAGE ) ) {
			return;
		}
		$event = isset( $_GET['vh_event'] ) ? (int) $_GET['vh_event'] : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$url   = wp_nonce_url( admin_url( 'admin-post.php?action=vine_events_export&event=' . $event ), 'vine_events_export' );
		printf(
			'<div class="alignleft actions"><a class="button" href="%s">%s</a></div>',
			esc_url( $url ),
			$event ? esc_html__( 'Export this event (CSV)', 'vine-house-events' ) : esc_html__( 'Export all (CSV)', 'vine-house-events' )
		);
	}

	// ---- events list -------------------------------------------------------

	/** @param array<string, string> $columns */
	public static function event_columns( array $columns ): array {
		$out = array();
		foreach ( $columns as $key => $label ) {
			$out[ $key ] = $label;
			if ( 'title' === $key ) {
				$out['vh_when']     = __( 'When', 'vine-house-events' );
				$out['vh_bookings'] = __( 'Bookings', 'vine-house-events' );
			}
		}
		return $out;
	}

	public static function event_column( string $column, int $post_id ): void {
		if ( 'vh_when' === $column ) {
			echo esc_html( Vine_Events_Event_Type::when( $post_id ) );
			return;
		}
		if ( 'vh_bookings' !== $column ) {
			return;
		}
		$counts   = Vine_Events_Bookings::counts( $post_id );
		$capacity = (int) get_post_meta( $post_id, 'vh_capacity', true );
		$status   = Vine_Events_Event_Type::booking_status( $post_id );
		$text     = $capacity > 0 ? sprintf( '%d / %d', $counts['confirmed_guests'], $capacity ) : (string) $counts['confirmed_guests'];
		if ( $counts['waitlisted_guests'] ) {
			$text .= sprintf( ' (+%d)', $counts['waitlisted_guests'] );
		}
		printf(
			'<a href="%s">%s</a><br><span style="color:#646970">%s</span>',
			esc_url( admin_url( 'edit.php?post_type=' . Vine_Events_Booking_Type::TYPE . '&vh_event=' . $post_id ) ),
			esc_html( $text ),
			esc_html( str_replace( '_', ' ', $status ) )
		);
	}

	// ---- actions -----------------------------------------------------------

	public static function toggle_checkin(): void {
		$id = isset( $_GET['booking'] ) ? (int) $_GET['booking'] : 0;
		check_admin_referer( 'vine_events_checkin_' . $id );
		self::guard( $id );
		Vine_Events_Bookings::set_checked_in( $id, ! get_post_meta( $id, 'vh_checked_in', true ) );
		self::back();
	}

	public static function cancel_booking(): void {
		$id = isset( $_GET['booking'] ) ? (int) $_GET['booking'] : 0;
		check_admin_referer( 'vine_events_cancel_' . $id );
		self::guard( $id );
		Vine_Events_Bookings::cancel( $id );
		self::back( 'cancelled' );
	}

	private static function guard( int $booking_id ): void {
		if ( ! current_user_can( VINE_EVENTS_CAP_MANAGE ) || Vine_Events_Booking_Type::TYPE !== get_post_type( $booking_id ) ) {
			wp_die( esc_html__( 'You do not have permission to do that.', 'vine-house-events' ) );
		}
	}

	private static function back( string $notice = '' ): void {
		$to = wp_get_referer() ?: admin_url( 'edit.php?post_type=' . Vine_Events_Booking_Type::TYPE );
		if ( $notice ) {
			$to = add_query_arg( 'vine_notice', $notice, $to );
		}
		wp_safe_redirect( $to );
		exit;
	}

	public static function notices(): void {
		$notice = isset( $_GET['vine_notice'] ) ? sanitize_key( (string) $_GET['vine_notice'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$messages = array(
			'cancelled' => __( 'Booking cancelled. Any waitlisted guests who now fit have been confirmed and emailed.', 'vine-house-events' ),
			'added'     => __( 'Booking added and the guest emailed.', 'vine-house-events' ),
		);
		if ( isset( $messages[ $notice ] ) ) {
			printf( '<div class="notice notice-success is-dismissible"><p>%s</p></div>', esc_html( $messages[ $notice ] ) );
		}
		if ( 'error' === $notice && ! empty( $_GET['vine_error'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			printf( '<div class="notice notice-error"><p>%s</p></div>', esc_html( sanitize_text_field( wp_unslash( (string) $_GET['vine_error'] ) ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
	}

	// ---- add booking (office) ---------------------------------------------

	public static function render_add(): void {
		if ( ! current_user_can( VINE_EVENTS_CAP_MANAGE ) ) {
			wp_die( esc_html__( 'You do not have permission to view this page.', 'vine-house-events' ) );
		}
		$preselect = isset( $_GET['event'] ) ? (int) $_GET['event'] : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$events    = Vine_Events_Event_Type::upcoming();
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Add Booking', 'vine-house-events' ); ?></h1>
			<p><?php esc_html_e( 'For bookings taken by phone or at the door. The office can book past capacity and outside the booking window; the guest receives the same confirmation email as a website booking.', 'vine-house-events' ); ?></p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="vine_events_add">
				<?php wp_nonce_field( 'vine_events_add' ); ?>
				<table class="form-table" role="presentation">
					<tr><th><label for="event_id"><?php esc_html_e( 'Event', 'vine-house-events' ); ?></label></th>
						<td><select id="event_id" name="event_id" required>
							<option value=""><?php esc_html_e( 'Choose an event', 'vine-house-events' ); ?></option>
							<?php foreach ( $events as $event ) : ?>
								<option value="<?php echo (int) $event->ID; ?>" <?php selected( $preselect, $event->ID ); ?>>
									<?php echo esc_html( get_post_meta( $event->ID, 'vh_event_date', true ) . ' — ' . $event->post_title ); ?>
								</option>
							<?php endforeach; ?>
						</select></td></tr>
					<tr><th><label for="name"><?php esc_html_e( 'Name', 'vine-house-events' ); ?></label></th>
						<td><input type="text" id="name" name="name" class="regular-text" required></td></tr>
					<tr><th><label for="email"><?php esc_html_e( 'Email', 'vine-house-events' ); ?></label></th>
						<td><input type="email" id="email" name="email" class="regular-text" required></td></tr>
					<tr><th><label for="phone"><?php esc_html_e( 'Phone', 'vine-house-events' ); ?></label></th>
						<td><input type="text" id="phone" name="phone" class="regular-text"></td></tr>
					<tr><th><label for="guestsCount"><?php esc_html_e( 'Guests', 'vine-house-events' ); ?></label></th>
						<td><input type="number" id="guestsCount" name="guestsCount" min="1" max="20" value="1"></td></tr>
					<tr><th><?php esc_html_e( 'First visit', 'vine-house-events' ); ?></th>
						<td><label><input type="checkbox" name="isFirstTimeVisitor" value="1"> <?php esc_html_e( 'This is their first time with us', 'vine-house-events' ); ?></label></td></tr>
					<tr><th><label for="notes"><?php esc_html_e( 'Notes', 'vine-house-events' ); ?></label></th>
						<td><textarea id="notes" name="notes" rows="3" class="large-text"></textarea></td></tr>
				</table>
				<?php submit_button( __( 'Add booking', 'vine-house-events' ) ); ?>
			</form>
		</div>
		<?php
	}

	public static function handle_add(): void {
		check_admin_referer( 'vine_events_add' );
		if ( ! current_user_can( VINE_EVENTS_CAP_MANAGE ) ) {
			wp_die( esc_html__( 'You do not have permission to do that.', 'vine-house-events' ) );
		}
		$fields = wp_unslash( $_POST ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- validated field by field below
		$data   = Vine_Events_Validation::booking( is_array( $fields ) ? $fields : array() );
		$back   = admin_url( 'edit.php?post_type=' . Vine_Events_Event_Type::TYPE . '&page=' . self::PAGE_ADD );

		if ( is_wp_error( $data ) ) {
			wp_safe_redirect( add_query_arg( array( 'vine_notice' => 'error', 'vine_error' => rawurlencode( $data->get_error_message() ) ), $back ) );
			exit;
		}
		$result = Vine_Events_Bookings::create( (int) ( $fields['event_id'] ?? 0 ), $data, 'office' );
		if ( is_wp_error( $result ) ) {
			wp_safe_redirect( add_query_arg( array( 'vine_notice' => 'error', 'vine_error' => rawurlencode( $result->get_error_message() ) ), $back ) );
			exit;
		}
		wp_safe_redirect( add_query_arg( array( 'vine_notice' => 'added', 'vh_event' => $result['event']['id'] ), admin_url( 'edit.php?post_type=' . Vine_Events_Booking_Type::TYPE ) ) );
		exit;
	}

	// ---- settings ----------------------------------------------------------

	public static function settings(): void {
		register_setting( 'vine_events', Vine_Events_Mail::OPTION_NOTIFY, array( 'type' => 'string', 'sanitize_callback' => 'sanitize_email', 'default' => '' ) );
		register_setting( 'vine_events', Vine_Events_Mail::OPTION_FRONTEND, array( 'type' => 'string', 'sanitize_callback' => 'esc_url_raw', 'default' => '' ) );
		register_setting( 'vine_events', Vine_Events_Mail::OPTION_FROM_NAME, array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field', 'default' => '' ) );
		register_setting( 'vine_events', Vine_Events_Mail::OPTION_REMINDERS, array( 'type' => 'boolean', 'sanitize_callback' => static fn( $v ): bool => (bool) $v, 'default' => true ) );

		add_settings_section( 'vine_events_main', '', '__return_false', self::PAGE_SETTINGS );

		$text = static function ( string $option, string $type, string $placeholder = '' ): void {
			printf(
				'<input type="%1$s" class="regular-text" name="%2$s" value="%3$s" placeholder="%4$s">',
				esc_attr( $type ),
				esc_attr( $option ),
				esc_attr( (string) get_option( $option, '' ) ),
				esc_attr( $placeholder )
			);
		};
		add_settings_field( Vine_Events_Mail::OPTION_NOTIFY, __( 'Notify the office at', 'vine-house-events' ), static fn() => $text( Vine_Events_Mail::OPTION_NOTIFY, 'email', (string) get_option( 'admin_email' ) ), self::PAGE_SETTINGS, 'vine_events_main' );
		add_settings_field( Vine_Events_Mail::OPTION_FROM_NAME, __( 'Emails come from', 'vine-house-events' ), static fn() => $text( Vine_Events_Mail::OPTION_FROM_NAME, 'text', 'Vine House Ministries' ), self::PAGE_SETTINGS, 'vine_events_main' );
		add_settings_field( Vine_Events_Mail::OPTION_FRONTEND, __( 'Website address', 'vine-house-events' ), static function () use ( $text ): void {
			$text( Vine_Events_Mail::OPTION_FRONTEND, 'url', home_url() );
			echo '<p class="description">' . esc_html__( 'Where "manage my booking" links in emails point. The Next.js site, not this WordPress install.', 'vine-house-events' ) . '</p>';
		}, self::PAGE_SETTINGS, 'vine_events_main' );
		add_settings_field( Vine_Events_Mail::OPTION_REMINDERS, __( 'Reminders', 'vine-house-events' ), static function (): void {
			printf(
				'<label><input type="checkbox" name="%s" value="1" %s> %s</label>',
				esc_attr( Vine_Events_Mail::OPTION_REMINDERS ),
				checked( (bool) get_option( Vine_Events_Mail::OPTION_REMINDERS, true ), true, false ),
				esc_html__( 'Email confirmed guests the day before their event', 'vine-house-events' )
			);
		}, self::PAGE_SETTINGS, 'vine_events_main' );
	}

	public static function render_settings(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to view this page.', 'vine-house-events' ) );
		}
		echo '<div class="wrap"><h1>' . esc_html__( 'Booking Settings', 'vine-house-events' ) . '</h1><form method="post" action="options.php">';
		settings_fields( 'vine_events' );
		do_settings_sections( self::PAGE_SETTINGS );
		submit_button();
		echo '</form></div>';
	}
}
