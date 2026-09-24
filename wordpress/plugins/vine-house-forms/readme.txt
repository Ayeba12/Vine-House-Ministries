=== Vine House Forms ===
Contributors: vinehouseministries
Requires at least: 6.4
Tested up to: 6.8
Requires PHP: 8.1
Stable tag: 0.2.0
License: GPLv2 or later

Receives the website's newsletter sign-ups, enquiries and visit plans and keeps them as private records the church office can manage and export.

== Description ==

The Vine House Ministries website is a Next.js app that reads content from WordPress. Its forms post back through this plugin's REST endpoints, authenticated with an application password held by a user in the "Vine Forms Client" role — a role that can submit and do nothing else.

Endpoints, all POST under /wp-json/vine/v1/:

* subscribe — idempotent on email
* enquiry — contact form and gathering interest, with a category
* visit-plan — plan-a-visit and visitor pass, returns a pass code

Event bookings are handled by the Vine House Events plugin, which shares the same API role.

Records are private post types: not queryable, not in the public REST index, not in WPGraphQL. Administrators and editors manage them under the "Vine Forms" menu and export any list as CSV. Each submission emails the church office.

== Changelog ==

= 0.2.0 =
* RSVPs moved to Vine House Events, which owns events and bookings end to end.

= 0.1.0 =
* First version.
