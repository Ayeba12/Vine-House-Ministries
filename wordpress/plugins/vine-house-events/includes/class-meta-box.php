<?php
/**
 * The event edit screen: one box for details and booking rules, and a
 * side box showing how bookings stand.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Meta_Box {

	private const NONCE = 'vine_events_details';

	public static function init(): void {
		add_action( 'add_meta_boxes_' . Vine_Events_Event_Type::TYPE, array( __CLASS__, 'add' ) );
		add_action( 'save_post_' . Vine_Events_Event_Type::TYPE, array( __CLASS__, 'save' ), 10, 2 );
	}

	public static function add(): void {
		add_meta_box( 'vine_event_details', __( 'Event details & booking', 'vine-house-events' ), array( __CLASS__, 'render' ), Vine_Events_Event_Type::TYPE, 'normal', 'high' );
		add_meta_box( 'vine_event_bookings', __( 'Bookings', 'vine-house-events' ), array( __CLASS__, 'render_bookings' ), Vine_Events_Event_Type::TYPE, 'side', 'high' );
	}

	public static function render( WP_Post $post ): void {
		wp_nonce_field( self::NONCE, self::NONCE );
		$v = static fn( string $key ) => get_post_meta( $post->ID, $key, true );
		?>
		<style>
			.vine-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px 20px; }
			.vine-grid label { display: block; font-weight: 600; margin-bottom: 4px; }
			.vine-grid input[type=text], .vine-grid input[type=url], .vine-grid input[type=date],
			.vine-grid input[type=time], .vine-grid input[type=datetime-local], .vine-grid input[type=number],
			.vine-grid textarea { width: 100%; }
			.vine-grid .full { grid-column: 1 / -1; }
			.vine-section { margin: 16px 0 8px; padding-top: 12px; border-top: 1px solid #dcdcde; font-weight: 600; }
			.vine-help { color: #646970; font-weight: 400; margin: 4px 0 0; }
		</style>

		<div class="vine-grid">
			<div><label for="vh_event_date"><?php esc_html_e( 'Date', 'vine-house-events' ); ?></label>
				<input type="date" id="vh_event_date" name="vh_event_date" value="<?php echo esc_attr( $v( 'vh_event_date' ) ); ?>" required></div>
			<div><label for="vh_start_time"><?php esc_html_e( 'Start time', 'vine-house-events' ); ?></label>
				<input type="time" id="vh_start_time" name="vh_start_time" value="<?php echo esc_attr( $v( 'vh_start_time' ) ); ?>"></div>
			<div><label for="vh_end_time"><?php esc_html_e( 'End time', 'vine-house-events' ); ?></label>
				<input type="time" id="vh_end_time" name="vh_end_time" value="<?php echo esc_attr( $v( 'vh_end_time' ) ); ?>"></div>
			<div><label for="vh_host"><?php esc_html_e( 'Host', 'vine-house-events' ); ?></label>
				<input type="text" id="vh_host" name="vh_host" value="<?php echo esc_attr( $v( 'vh_host' ) ); ?>"></div>
			<div><label for="vh_location"><?php esc_html_e( 'Location', 'vine-house-events' ); ?></label>
				<input type="text" id="vh_location" name="vh_location" value="<?php echo esc_attr( $v( 'vh_location' ) ); ?>"></div>
			<div><label for="vh_room"><?php esc_html_e( 'Room', 'vine-house-events' ); ?></label>
				<input type="text" id="vh_room" name="vh_room" value="<?php echo esc_attr( $v( 'vh_room' ) ); ?>"></div>
			<div class="full"><label for="vh_online_url"><?php esc_html_e( 'Online link', 'vine-house-events' ); ?></label>
				<input type="url" id="vh_online_url" name="vh_online_url" value="<?php echo esc_attr( $v( 'vh_online_url' ) ); ?>" placeholder="https://">
				<p class="vine-help"><?php esc_html_e( 'Broadcast or meeting link, included in confirmation emails.', 'vine-house-events' ); ?></p></div>
			<div class="full"><label for="vh_highlights"><?php esc_html_e( 'Highlights', 'vine-house-events' ); ?></label>
				<textarea id="vh_highlights" name="vh_highlights" rows="3"><?php echo esc_textarea( $v( 'vh_highlights' ) ); ?></textarea>
				<p class="vine-help"><?php esc_html_e( 'One per line. Shown as short points on the event card.', 'vine-house-events' ); ?></p></div>
		</div>

		<div class="vine-section"><?php esc_html_e( 'Booking', 'vine-house-events' ); ?></div>
		<div class="vine-grid">
			<div class="full"><label><input type="checkbox" name="vh_booking_enabled" value="1" <?php checked( $v( 'vh_booking_enabled' ) ); ?>>
				<?php esc_html_e( 'Take bookings for this event', 'vine-house-events' ); ?></label></div>
			<div><label for="vh_capacity"><?php esc_html_e( 'Capacity (guests)', 'vine-house-events' ); ?></label>
				<input type="number" id="vh_capacity" name="vh_capacity" min="0" step="1" value="<?php echo esc_attr( (string) (int) $v( 'vh_capacity' ) ); ?>">
				<p class="vine-help"><?php esc_html_e( '0 means unlimited.', 'vine-house-events' ); ?></p></div>
			<div><label for="vh_max_guests"><?php esc_html_e( 'Max guests per booking', 'vine-house-events' ); ?></label>
				<input type="number" id="vh_max_guests" name="vh_max_guests" min="1" max="20" step="1" value="<?php echo esc_attr( (string) max( 1, (int) $v( 'vh_max_guests' ) ) ); ?>"></div>
			<div class="full"><label><input type="checkbox" name="vh_waitlist" value="1" <?php checked( $v( 'vh_waitlist' ) ); ?>>
				<?php esc_html_e( 'Offer a waitlist when full', 'vine-house-events' ); ?></label>
				<p class="vine-help"><?php esc_html_e( 'Waitlisted guests are confirmed automatically, in order, when a booking is cancelled.', 'vine-house-events' ); ?></p></div>
			<div><label for="vh_booking_opens"><?php esc_html_e( 'Booking opens', 'vine-house-events' ); ?></label>
				<input type="datetime-local" id="vh_booking_opens" name="vh_booking_opens" value="<?php echo esc_attr( $v( 'vh_booking_opens' ) ); ?>">
				<p class="vine-help"><?php esc_html_e( 'Leave empty to open immediately.', 'vine-house-events' ); ?></p></div>
			<div><label for="vh_booking_closes"><?php esc_html_e( 'Booking closes', 'vine-house-events' ); ?></label>
				<input type="datetime-local" id="vh_booking_closes" name="vh_booking_closes" value="<?php echo esc_attr( $v( 'vh_booking_closes' ) ); ?>">
				<p class="vine-help"><?php esc_html_e( 'Leave empty to close when the event starts.', 'vine-house-events' ); ?></p></div>
		</div>
		<?php
	}

	public static function render_bookings( WP_Post $post ): void {
		if ( 'auto-draft' === $post->post_status ) {
			echo '<p>' . esc_html__( 'Save the event to start taking bookings.', 'vine-house-events' ) . '</p>';
			return;
		}
		$counts   = Vine_Events_Bookings::counts( $post->ID );
		$capacity = (int) get_post_meta( $post->ID, 'vh_capacity', true );
		$status   = Vine_Events_Event_Type::booking_status( $post->ID );
		$labels   = array(
			'open'         => __( 'Open', 'vine-house-events' ),
			'waitlist'     => __( 'Full — waitlist open', 'vine-house-events' ),
			'full'         => __( 'Full', 'vine-house-events' ),
			'closed'       => __( 'Closed', 'vine-house-events' ),
			'not_yet_open' => __( 'Not open yet', 'vine-house-events' ),
			'disabled'     => __( 'Not taking bookings', 'vine-house-events' ),
		);
		$list   = admin_url( 'edit.php?post_type=' . Vine_Events_Booking_Type::TYPE . '&vh_event=' . $post->ID );
		$export = wp_nonce_url( admin_url( 'admin-post.php?action=vine_events_export&event=' . $post->ID ), 'vine_events_export' );
		$add    = admin_url( 'edit.php?post_type=' . Vine_Events_Event_Type::TYPE . '&page=vine-events-add&event=' . $post->ID );
		?>
		<p><strong><?php echo esc_html( $labels[ $status ] ?? $status ); ?></strong></p>
		<p>
			<?php
			echo esc_html(
				$capacity > 0
					? sprintf( /* translators: 1: confirmed guests, 2: capacity */ __( '%1$d of %2$d places taken', 'vine-house-events' ), $counts['confirmed_guests'], $capacity )
					: sprintf( /* translators: %d: confirmed guests */ __( '%d guests confirmed', 'vine-house-events' ), $counts['confirmed_guests'] )
			);
			?>
			<br>
			<?php echo esc_html( sprintf( /* translators: 1: bookings, 2: waitlisted guests, 3: checked-in guests */ __( '%1$d bookings · %2$d waitlisted · %3$d checked in', 'vine-house-events' ), $counts['confirmed'], $counts['waitlisted_guests'], $counts['checked_in'] ) ); ?>
		</p>
		<p>
			<a class="button" href="<?php echo esc_url( $list ); ?>"><?php esc_html_e( 'View bookings', 'vine-house-events' ); ?></a>
			<a class="button" href="<?php echo esc_url( $add ); ?>"><?php esc_html_e( 'Add booking', 'vine-house-events' ); ?></a>
		</p>
		<p><a href="<?php echo esc_url( $export ); ?>"><?php esc_html_e( 'Export attendee list (CSV)', 'vine-house-events' ); ?></a></p>
		<?php
	}

	public static function save( int $post_id, WP_Post $post ): void {
		if ( ! isset( $_POST[ self::NONCE ] ) || ! wp_verify_nonce( sanitize_key( (string) $_POST[ self::NONCE ] ), self::NONCE ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$text = static fn( string $key ): string => isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( (string) $_POST[ $key ] ) ) : '';

		$date = $text( 'vh_event_date' );
		update_post_meta( $post_id, 'vh_event_date', preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) ? $date : '' );
		foreach ( array( 'vh_start_time', 'vh_end_time' ) as $key ) {
			$time = $text( $key );
			update_post_meta( $post_id, $key, preg_match( '/^\d{2}:\d{2}$/', $time ) ? $time : '' );
		}
		foreach ( array( 'vh_booking_opens', 'vh_booking_closes' ) as $key ) {
			$when = $text( $key );
			update_post_meta( $post_id, $key, preg_match( '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/', $when ) ? $when : '' );
		}
		foreach ( array( 'vh_location', 'vh_room', 'vh_host' ) as $key ) {
			update_post_meta( $post_id, $key, $text( $key ) );
		}
		update_post_meta( $post_id, 'vh_online_url', esc_url_raw( $text( 'vh_online_url' ) ) );
		update_post_meta( $post_id, 'vh_highlights', isset( $_POST['vh_highlights'] ) ? sanitize_textarea_field( wp_unslash( (string) $_POST['vh_highlights'] ) ) : '' );
		update_post_meta( $post_id, 'vh_booking_enabled', empty( $_POST['vh_booking_enabled'] ) ? 0 : 1 );
		update_post_meta( $post_id, 'vh_waitlist', empty( $_POST['vh_waitlist'] ) ? 0 : 1 );
		update_post_meta( $post_id, 'vh_capacity', max( 0, (int) ( $_POST['vh_capacity'] ?? 0 ) ) );
		update_post_meta( $post_id, 'vh_max_guests', min( 20, max( 1, (int) ( $_POST['vh_max_guests'] ?? 6 ) ) ) );
	}
}
