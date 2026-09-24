# WordPress side of the headless build

WordPress itself is **not** in this repository. It lives in its own LocalWP site during
development and moves to Bluehost with a migration plugin. What *is* versioned here is the
custom code WordPress needs — three plugins — so it can be reviewed, reinstalled and
carried to production like any other source.

```
wordpress/
├── plugins/
│   ├── vine-house-content/   sermons, gatherings, testimonials, site settings (ACF)
│   ├── vine-house-events/    events and bookings: capacity, waitlist, check-in, emails
│   └── vine-house-forms/     newsletter, enquiries, visit plans
└── README.md
```

| Plugin | Needs | Owns in wp-admin |
| --- | --- | --- |
| Content | ACF Pro, WPGraphQL, WPGraphQL for ACF | Sermons, Gatherings, Testimonials, Site Settings |
| Events | WPGraphQL | Events, Bookings, Add Booking, Settings |
| Forms | — | Vine Forms: Subscribers, Enquiries, Visit plans |

Events and Forms share one API role, `vine_forms_client`, and one capability,
`vine_submit_forms`. Whichever activates first creates the role; neither removes it.

## Install into LocalWP

The Local site is expected at `C:\Users\Ayeba\Local Sites\vine-house-ministries`. From
this repository's root, link all three plugins so edits here show up in WordPress
immediately. Directory junctions do this without administrator rights:

```powershell
$wp = "C:\Users\Ayeba\Local Sites\vine-house-ministries\app\public\wp-content\plugins"
cmd /c mklink /J "$wp\vine-house-content" "$PWD\wordpress\plugins\vine-house-content"
cmd /c mklink /J "$wp\vine-house-events"  "$PWD\wordpress\plugins\vine-house-events"
cmd /c mklink /J "$wp\vine-house-forms"   "$PWD\wordpress\plugins\vine-house-forms"
```

Copying the folders works too; you just have to copy again after each change. On Bluehost
the folders are copied, not linked.

Then in wp-admin:

1. Install and activate **WPGraphQL**, **Advanced Custom Fields PRO** and **WPGraphQL for
   ACF**.
2. Activate **Vine House Content**, **Vine House Events**, then **Vine House Forms**.
3. ACF picks the Content field groups up from `vine-house-content/acf-json/`. Open
   *Custom Fields → Field Groups* once so it syncs them.
4. Settings → Permalinks → Save (once) so the new post types get their rewrite rules.
5. Events → Settings: set the website address (where "manage my booking" links point)
   and the office email.

## The submissions user

The Next.js route handlers authenticate to the Events and Forms endpoints with an
[application password](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/).
Give it a user that can do nothing else:

1. Users → Add New. Username `vine-forms`, role **Vine Forms Client**.
2. Open that user, scroll to *Application Passwords*, add one named `vercel`, and copy the
   generated password into `.env.local` as `WORDPRESS_APP_PASSWORD` (spaces included, they
   are part of it).

Application passwords are only offered over HTTPS by default. LocalWP sites are `http://`,
so for development add this to the site's `wp-config.php`:

```php
// Development only. Never ship this to Bluehost.
add_filter( 'wp_is_application_passwords_available', '__return_true' );
```

## Smoke test

With the plugins active, an event published with a capacity, and the password in hand:

```bash
curl -u "vine-forms:xxxx xxxx xxxx xxxx xxxx xxxx" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Person","email":"test@example.com","guestsCount":2}' \
  http://vine-house-ministries.local/wp-json/vine/v1/events/<EVENT_ID>/bookings
```

A `201` with a `passCode` means the whole chain works: the booking appears under
*Events → Bookings*, the event's count moves, and two emails go out (guest and office —
LocalWP catches them in its Mailpit tab). Post the same body again and you get `200` with
`"existing": true` rather than a duplicate.

Then confirm the privacy boundary. Neither of these may return submission or booking
types:

```bash
curl -s http://vine-house-ministries.local/wp-json/wp/v2/types | grep -c "vh_"
```

```bash
curl -s -X POST http://vine-house-ministries.local/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ vhBookings { nodes { id } } }"}'
```

The first must print `0`; the second must return an error, not data.

And the public read that the website will use:

```bash
curl -s -X POST http://vine-house-ministries.local/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ churchEvents { nodes { title eventDate startTime capacity bookedCount remaining bookingStatus } } }"}'
```

## Cron on Bluehost

Day-before reminders run from WP-Cron, which fires on page views — and a headless site
gets few. On Bluehost, add `define( 'DISABLE_WP_CRON', true );` to `wp-config.php` and a
real cron entry every fifteen minutes:

```
*/15 * * * * php -q /home/<account>/public_html/wp-cron.php >/dev/null 2>&1
```
