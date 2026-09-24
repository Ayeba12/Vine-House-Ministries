<?php
/**
 * Input validation for every endpoint.
 *
 * Each public method takes the raw request parameters and returns either a
 * clean, typed array or a WP_Error whose data carries a 400 status and the
 * field that failed, so the frontend can put the message next to the input.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Forms_Validation {

	public const FREQUENCIES = array( 'Weekly Devotional', 'Event Announcements', 'All Updates' );
	public const CATEGORIES  = array( 'general', 'prayer', 'sacraments', 'charity', 'gathering' );

	/** @return array<string, mixed>|WP_Error */
	public static function rsvp( array $p ) {
		$out = array();
		foreach (
			array(
				'name'  => self::text( $p, 'name', 2, 120, true ),
				'email' => self::email( $p, 'email', true ),
				'phone' => self::phone( $p, 'phone', false ),
				'notes' => self::text( $p, 'notes', 0, 1000, false ),
			) as $key => $value
		) {
			if ( is_wp_error( $value ) ) {
				return $value;
			}
			$out[ $key ] = $value;
		}

		$out['event_id']     = self::int( $p, 'eventId', 1, PHP_INT_MAX, true );
		$out['guests_count'] = self::int( $p, 'guestsCount', 1, 10, true );
		$out['first_time']   = self::bool( $p, 'isFirstTimeVisitor' );

		foreach ( array( 'event_id', 'guests_count' ) as $key ) {
			if ( is_wp_error( $out[ $key ] ) ) {
				return $out[ $key ];
			}
		}
		return $out;
	}

	/** @return array<string, mixed>|WP_Error */
	public static function subscribe( array $p ) {
		$email = self::email( $p, 'email', true );
		if ( is_wp_error( $email ) ) {
			return $email;
		}
		$frequency = self::enum( $p, 'frequency', self::FREQUENCIES, 'All Updates' );
		if ( is_wp_error( $frequency ) ) {
			return $frequency;
		}
		return array(
			'email'     => $email,
			'frequency' => $frequency,
		);
	}

	/** @return array<string, mixed>|WP_Error */
	public static function enquiry( array $p ) {
		$out = array();
		foreach (
			array(
				'category' => self::enum( $p, 'category', self::CATEGORIES, 'general' ),
				'name'     => self::text( $p, 'name', 2, 120, true ),
				'email'    => self::email( $p, 'email', true ),
				'phone'    => self::phone( $p, 'phone', false ),
				'message'  => self::text( $p, 'message', 0, 4000, false ),
				'source'   => self::text( $p, 'source', 0, 80, false ),
			) as $key => $value
		) {
			if ( is_wp_error( $value ) ) {
				return $value;
			}
			$out[ $key ] = $value;
		}
		$out['gathering_id'] = self::int( $p, 'gatheringId', 0, PHP_INT_MAX, false );
		if ( is_wp_error( $out['gathering_id'] ) ) {
			return $out['gathering_id'];
		}
		return $out;
	}

	/** @return array<string, mixed>|WP_Error */
	public static function visit_plan( array $p ) {
		$out = array();
		foreach (
			array(
				'name'          => self::text( $p, 'name', 2, 120, true ),
				'email'         => self::email( $p, 'email', true ),
				'phone'         => self::phone( $p, 'phone', false ),
				'service'       => self::text( $p, 'service', 2, 120, true ),
				'visit_date'    => self::date( $p, 'date', false ),
				'children_ages' => self::text( $p, 'childrenAges', 0, 200, false ),
				'notes'         => self::text( $p, 'notes', 0, 1000, false ),
			) as $key => $value
		) {
			if ( is_wp_error( $value ) ) {
				return $value;
			}
			$out[ $key ] = $value;
		}
		$out['party_size']   = self::int( $p, 'partySize', 1, 20, true );
		$out['children']     = self::bool( $p, 'children' );
		$out['welcome_host'] = self::bool( $p, 'welcomeHost' );
		if ( is_wp_error( $out['party_size'] ) ) {
			return $out['party_size'];
		}
		return $out;
	}

	// ---- primitives --------------------------------------------------------

	private static function fail( string $field, string $message ): WP_Error {
		return new WP_Error(
			'vine_forms_invalid',
			$message,
			array(
				'status' => 400,
				'field'  => $field,
			)
		);
	}

	/** @return string|WP_Error */
	private static function text( array $p, string $key, int $min, int $max, bool $required ) {
		$value = isset( $p[ $key ] ) && is_scalar( $p[ $key ] ) ? sanitize_textarea_field( (string) $p[ $key ] ) : '';
		$value = trim( $value );
		if ( '' === $value ) {
			return $required ? self::fail( $key, __( 'This field is required.', 'vine-house-forms' ) ) : '';
		}
		$length = mb_strlen( $value );
		if ( $length < $min ) {
			return self::fail( $key, sprintf( /* translators: %d: minimum length */ __( 'Please enter at least %d characters.', 'vine-house-forms' ), $min ) );
		}
		if ( $length > $max ) {
			return self::fail( $key, sprintf( /* translators: %d: maximum length */ __( 'Please keep this under %d characters.', 'vine-house-forms' ), $max ) );
		}
		return $value;
	}

	/** @return string|WP_Error */
	private static function email( array $p, string $key, bool $required ) {
		$value = isset( $p[ $key ] ) && is_scalar( $p[ $key ] ) ? sanitize_email( (string) $p[ $key ] ) : '';
		if ( '' === $value ) {
			return $required ? self::fail( $key, __( 'Please enter your email address.', 'vine-house-forms' ) ) : '';
		}
		if ( ! is_email( $value ) ) {
			return self::fail( $key, __( 'That email address does not look right.', 'vine-house-forms' ) );
		}
		return strtolower( $value );
	}

	/** @return string|WP_Error */
	private static function phone( array $p, string $key, bool $required ) {
		$value = isset( $p[ $key ] ) && is_scalar( $p[ $key ] ) ? preg_replace( '/[^0-9+ ()-]/', '', (string) $p[ $key ] ) : '';
		$value = trim( (string) $value );
		if ( '' === $value ) {
			return $required ? self::fail( $key, __( 'Please enter a phone number.', 'vine-house-forms' ) ) : '';
		}
		if ( strlen( preg_replace( '/\D/', '', $value ) ) < 7 ) {
			return self::fail( $key, __( 'That phone number looks too short.', 'vine-house-forms' ) );
		}
		return $value;
	}

	/** @return int|WP_Error */
	private static function int( array $p, string $key, int $min, int $max, bool $required ) {
		if ( ! isset( $p[ $key ] ) || '' === $p[ $key ] ) {
			return $required ? self::fail( $key, __( 'This field is required.', 'vine-house-forms' ) ) : 0;
		}
		if ( ! is_numeric( $p[ $key ] ) ) {
			return self::fail( $key, __( 'Please enter a number.', 'vine-house-forms' ) );
		}
		$value = (int) $p[ $key ];
		if ( $value < $min || $value > $max ) {
			return self::fail( $key, sprintf( /* translators: 1: minimum, 2: maximum */ __( 'Please enter a number between %1$d and %2$d.', 'vine-house-forms' ), $min, $max ) );
		}
		return $value;
	}

	private static function bool( array $p, string $key ): bool {
		return isset( $p[ $key ] ) && filter_var( $p[ $key ], FILTER_VALIDATE_BOOLEAN );
	}

	/** @return string|WP_Error */
	private static function enum( array $p, string $key, array $allowed, string $default ) {
		if ( ! isset( $p[ $key ] ) || '' === $p[ $key ] ) {
			return $default;
		}
		$value = (string) $p[ $key ];
		if ( ! in_array( $value, $allowed, true ) ) {
			return self::fail( $key, __( 'Please choose one of the listed options.', 'vine-house-forms' ) );
		}
		return $value;
	}

	/** ISO date, returned as Y-m-d. @return string|WP_Error */
	private static function date( array $p, string $key, bool $required ) {
		$value = isset( $p[ $key ] ) && is_scalar( $p[ $key ] ) ? trim( (string) $p[ $key ] ) : '';
		if ( '' === $value ) {
			return $required ? self::fail( $key, __( 'Please choose a date.', 'vine-house-forms' ) ) : '';
		}
		$parsed = DateTimeImmutable::createFromFormat( '!Y-m-d', $value );
		if ( ! $parsed || $parsed->format( 'Y-m-d' ) !== $value ) {
			return self::fail( $key, __( 'Please send the date as YYYY-MM-DD.', 'vine-house-forms' ) );
		}
		return $value;
	}
}
