<?php
/**
 * A calendar file for one booking, attached to the confirmation email so
 * "add to calendar" is one tap in every mail client.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_ICS {

	public static function build( int $booking_id ): string {
		$event_id = (int) get_post_meta( $booking_id, 'vh_event_id', true );
		$start    = Vine_Events_Event_Type::start_datetime( $event_id );
		$end      = Vine_Events_Event_Type::end_datetime( $event_id );
		if ( ! $start || ! $end ) {
			return '';
		}

		$details  = Vine_Events_Event_Type::details( $event_id );
		$location = trim( $details['location'] . ( $details['room'] ? ', ' . $details['room'] : '' ) );
		$summary  = get_the_title( $event_id );
		$body     = sprintf(
			/* translators: 1: pass code, 2: guests */
			__( 'Your pass code is %1$s for %2$d guest(s). Show it at the door.', 'vine-house-events' ),
			get_post_meta( $booking_id, 'vh_pass_code', true ),
			(int) get_post_meta( $booking_id, 'vh_guests', true )
		);
		$host = wp_parse_url( home_url(), PHP_URL_HOST ) ?: 'vinehouseministries.org.uk';

		$lines = array(
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//Vine House Ministries//Events//EN',
			'CALSCALE:GREGORIAN',
			'METHOD:PUBLISH',
			'BEGIN:VEVENT',
			'UID:' . get_post_meta( $booking_id, 'vh_token', true ) . '@' . $host,
			'DTSTAMP:' . gmdate( 'Ymd\THis\Z' ),
			'DTSTART:' . $start->setTimezone( new DateTimeZone( 'UTC' ) )->format( 'Ymd\THis\Z' ),
			'DTEND:' . $end->setTimezone( new DateTimeZone( 'UTC' ) )->format( 'Ymd\THis\Z' ),
			'SUMMARY:' . self::escape( $summary ),
			'LOCATION:' . self::escape( $location ),
			'DESCRIPTION:' . self::escape( $body ),
			'END:VEVENT',
			'END:VCALENDAR',
		);

		return implode( "\r\n", array_map( array( __CLASS__, 'fold' ), $lines ) ) . "\r\n";
	}

	private static function escape( string $text ): string {
		return str_replace( array( '\\', ';', ',', "\n" ), array( '\\\\', '\;', '\,', '\n' ), $text );
	}

	/** RFC 5545 folds lines at 75 octets. */
	private static function fold( string $line ): string {
		$out = '';
		while ( strlen( $line ) > 75 ) {
			$out .= substr( $line, 0, 75 ) . "\r\n ";
			$line = substr( $line, 75 );
		}
		return $out . $line;
	}
}
