<?php
/**
 * Email the church office when something arrives, so nobody has to log in
 * to discover a prayer request.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Forms_Notify {

	public const OPTION = 'vine_forms_notify_email';

	public static function recipient(): string {
		$email = (string) get_option( self::OPTION, '' );
		if ( '' === $email ) {
			$email = (string) get_option( 'admin_email' );
		}
		/**
		 * Filter the address that receives submission notifications.
		 *
		 * @param string $email Recipient.
		 */
		return (string) apply_filters( 'vine_forms_notify_email', $email );
	}

	/**
	 * @param string               $type    One of the Vine_Forms_CPT constants.
	 * @param int                  $post_id The stored record.
	 * @param array<string, mixed> $data    The validated submission.
	 */
	public static function send( string $type, int $post_id, array $data ): void {
		$labels  = Vine_Forms_CPT::types()[ $type ]['singular'] ?? $type;
		$subject = sprintf( '[Vine House] New %s: %s', $labels, get_the_title( $post_id ) );

		$lines = array();
		foreach ( $data as $key => $value ) {
			if ( is_bool( $value ) ) {
				$value = $value ? 'yes' : 'no';
			}
			if ( '' === $value || null === $value ) {
				continue;
			}
			$lines[] = sprintf( '%s: %s', ucfirst( str_replace( '_', ' ', $key ) ), $value );
		}
		$lines[] = '';
		$lines[] = 'Open in WordPress: ' . admin_url( 'post.php?post=' . $post_id . '&action=edit' );

		wp_mail( self::recipient(), $subject, implode( "\n", $lines ) );
	}
}
