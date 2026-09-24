=== Vine House Events ===
Contributors: vinehouseministries
Requires at least: 6.4
Tested up to: 6.8
Requires PHP: 8.1
Stable tag: 0.1.0
License: GPLv2 or later

Events with bookings for the Vine House Ministries website: capacity, waitlists, pass codes, check-in, attendee emails with calendar files, day-before reminders and CSV export.

== Description ==

The website is a Next.js app that reads from WordPress through WPGraphQL. This plugin owns events and their bookings end to end.

**For the office**

* Create an event under Events with its date, times, venue, host, online link and highlights.
* Set the booking rules on the same screen: bookings on or off, capacity (0 = unlimited), the most guests one booking may cover, whether to run a waitlist when full, and when booking opens and closes.
* Watch bookings on the event itself and in the Bookings list, filtered by event and status.
* Check guests in on the day with one click; cancel a booking, which promotes the waitlist automatically.
* Add bookings taken by phone or at the door. The office can book past capacity and outside the window.
* Export any event's attendee list, or everything, as CSV.

**For guests**

* A confirmation email with a pass code, the event details, an attached calendar file and a link to cancel.
* A waitlist email when the event is full, and a promotion email the moment a place opens.
* A reminder the day before.

**For the website**

* `ChurchEvent` in GraphQL carries eventDate, startTime, endTime, location, room, host, onlineUrl, highlights, capacity, bookedCount, waitlistedCount, remaining and bookingStatus, so the page renders the right button from one field.
* `POST /wp-json/vine/v1/events/{id}/bookings`, `GET /events/{id}/availability`, `GET /bookings/{token}` and `POST /bookings/{token}/cancel`, authenticated with an application password held by the Vine Forms Client role.

Bookings are private records: not queryable, not in the public REST index, not in GraphQL. Only the aggregate counts reach the website.

== Cron ==

Reminders run from a daily WP-Cron task. WordPress cron fires on page views, and a headless site gets few, so on the production host disable WP-Cron (`define( 'DISABLE_WP_CRON', true );`) and call `wp-cron.php` from a real cron entry every fifteen minutes.

== Changelog ==

= 0.1.0 =
* First version.
