<?php
/**
 * Booking input validation. Returns a clean, typed array or a WP_Error
 * carrying a 400 and the field that failed.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Validation {

	/** @return array{name:string,email:string,phone:string,guests:int,first_time:bool,notes:string}|WP_Error */
	public static function booking( array $p ) {
		$name = self::text( $p, 'name', 2, 120, true );
		if ( is_wp_error( $name ) ) {
			return $name;
		}
		$email = self::email( $p, 'email' );
		if ( is_wp_error( $email ) ) {
			return $email;
		}
		$phone = self::phone( $p, 'phone' );
		if ( is_wp_error( $phone ) ) {
			return $phone;
		}
		$guests = self::int( $p, 'guestsCount', 1, 20 );
		if ( is_wp_error( $guests ) ) {
			return $guests;
		}
		$notes = self::text( $p, 'notes', 0, 1000, false );
		if ( is_wp_error( $notes ) ) {
			return $notes;
		}
		return array(
			'name'       => $name,
			'email'      => $email,
			'phone'      => $phone,
			'guests'     => $guests,
			'first_time' => isset( $p['isFirstTimeVisitor'] ) && filter_var( $p['isFirstTimeVisitor'], FILTER_VALIDATE_BOOLEAN ),
			'notes'      => $notes,
		);
	}

	private static function fail( string $field, string $message ): WP_Error {
		return new WP_Error(
			'vine_events_invalid',
			$message,
			array(
				'status' => 400,
				'field'  => $field,
			)
		);
	}

	/** @return string|WP_Error */
	private static function text( array $p, string $key, int $min, int $max, bool $required ) {
		$value = isset( $p[ $key ] ) && is_scalar( $p[ $key ] ) ? trim( sanitize_textarea_field( (string) $p[ $key ] ) ) : '';
		if ( '' === $value ) {
			return $required ? self::fail( $key, __( 'This field is required.', 'vine-house-events' ) ) : '';
		}
		$length = mb_strlen( $value );
		if ( $length < $min ) {
			return self::fail( $key, sprintf( /* translators: %d: minimum length */ __( 'Please enter at least %d characters.', 'vine-house-events' ), $min ) );
		}
		if ( $length > $max ) {
			return self::fail( $key, sprintf( /* translators: %d: maximum length */ __( 'Please keep this under %d characters.', 'vine-house-events' ), $max ) );
		}
		return $value;
	}

	/** @return string|WP_Error */
	private static function email( array $p, string $key ) {
		$value = isset( $p[ $key ] ) && is_scalar( $p[ $key ] ) ? sanitize_email( (string) $p[ $key ] ) : '';
		if ( '' === $value ) {
			return self::fail( $key, __( 'Please enter your email address.', 'vine-house-events' ) );
		}
		if ( ! is_email( $value ) ) {
			return self::fail( $key, __( 'That email address does not look right.', 'vine-house-events' ) );
		}
		return strtolower( $value );
	}

	/** @return string|WP_Error */
	private static function phone( array $p, string $key ) {
		$value = isset( $p[ $key ] ) && is_scalar( $p[ $key ] ) ? trim( (string) preg_replace( '/[^0-9+ ()-]/', '', (string) $p[ $key ] ) ) : '';
		if ( '' === $value ) {
			return '';
		}
		if ( strlen( (string) preg_replace( '/\D/', '', $value ) ) < 7 ) {
			return self::fail( $key, __( 'That phone number looks too short.', 'vine-house-events' ) );
		}
		return $value;
	}

	/** @return int|WP_Error */
	private static function int( array $p, string $key, int $min, int $max ) {
		if ( ! isset( $p[ $key ] ) || '' === $p[ $key ] || ! is_numeric( $p[ $key ] ) ) {
			return self::fail( $key, __( 'Please enter how many guests are coming.', 'vine-house-events' ) );
		}
		$value = (int) $p[ $key ];
		if ( $value < $min || $value > $max ) {
			return self::fail( $key, sprintf( /* translators: 1: minimum, 2: maximum */ __( 'Please enter a number between %1$d and %2$d.', 'vine-house-events' ), $min, $max ) );
		}
		return $value;
	}
}
