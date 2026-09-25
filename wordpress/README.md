# WordPress side of the headless build

WordPress itself is **not** in this repository. It lives in its own LocalWP site during
development and moves to Bluehost with a migration plugin. What *is* versioned here is the
custom code WordPress needs — three plugins — so it can be reviewed, reinstalled and
carried to production like any other source.

```
wordpress/
├── plugins/
│   ├── vine-house-content/   sermons, messages (the journal), gatherings, testimonials,
│   │                         site settings (ACF), the publish webhook
│   ├── vine-house-events/    events and bookings: capacity, waitlist, check-in, emails
│   └── vine-house-forms/     newsletter, enquiries, visit plans
└── README.md
```

| Plugin | Needs | Owns in wp-admin |
| --- | --- | --- |
| Content | ACF Pro, WPGraphQL, WPGraphQL for ACF | Messages (posts), Sermons, Gatherings, Testimonials, Site Settings |
| Events | WPGraphQL | Events, Bookings, Add Booking, Settings |
| Forms | — | Vine Forms: Subscribers, Enquiries, Visit plans |

Events and Forms share one API role, `vine_forms_client`, and one capability,
`vine_submit_forms`. Whichever activates first creates the role; neither removes it.

## What the site reads, and from where

Every page reads through WPGraphQL and maps into the frontend's own types in
`lib/wordpress.ts`. This is the contract; if a name here changes, that file changes.

| On the site | In WordPress | GraphQL |
| --- | --- | --- |
| Messages, the journal (`/messages`) | standard **posts**, relabelled Messages. Category = kind (Pastoral Letter, Reflection, Teaching, Community; seeded on activation). Tags = themes. Featured image + its alt text. Excerpt. | `posts { … messageFields { authorRole scripture readTime pullQuote } }` |
| Sermons (`/sermons`, home) | CPT `sermon`; Series and Topics taxonomies; ACF group Sermon | `sermons { … sermonFields { speaker speakerRole sermonDate durationSeconds scripture summary keyTakeaways { text } audioFile audioUrl transcriptSnippet } }` |
| Events (`/events`, home) | CPT `church_event`, native meta from Vine House Events | `churchEvents { eventDate startTime endTime location room host highlights capacity bookedCount remaining bookingStatus }` |
| Gathering tiles (home) | CPT `gathering`, the four newest, shown in menu order | `gatherings { … gatheringFields { pillarNumber subtitle timing location tags { text } } }` |
| Voices (home) | CPT `testimonial`: title = author, content = quote, thumbnail = avatar | `testimonials { … testimonialFields { role tag } }` |
| Notice banner, service times, office details | Site Settings options page | `siteSettings { siteSettingsFields { noticeBannerEnabled noticeBanner officeEmail charityNumber region addressLine accessNote serviceTimes { label value } } }` |

Dates are stored as real dates (`Y-m-d`) and times as `HH:MM`; the frontend formats them.
`bookedCount`, `remaining` and `bookingStatus` are computed from bookings, never authored.

Without `WORDPRESS_GRAPHQL_ENDPOINT` set, the frontend runs on the seed content in
`lib/data.ts`. With it set and WordPress unreachable, it renders empty lists and logs why.

## Install into LocalWP

The Local site is expected at `C:\Users\Ayeba\Local Sites\vine-house-ministries`. Local runs
it in localhost mode, so it answers at `http://localhost:10030` (the `.local` domain is not
in the hosts file); that is the URL for `.env.local`. Mailpit, which catches every email the
plugins send, is at `http://localhost:10025`. From this repository's root, link all three plugins so edits here show up in WordPress
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
   Content seeds the four message categories; Events seeds the five event categories.
3. ACF picks the Content field groups up from `vine-house-content/acf-json/`. Open
   *Custom Fields → Field Groups* once so it syncs them. Five groups: Message, Sermon,
   Gathering, Testimonial, Site Settings.
4. Settings → Permalinks → Save (once) so the new post types get their rewrite rules.
5. Events → Settings: set the website address (where "manage my booking" links point)
   and the office email.
6. Site Settings: the notice banner, service times, region and office email.

## The publish webhook

The site caches every read for five minutes. To refresh it the moment something is
published, add to the Local site's `wp-config.php` (and later Bluehost's):

```php
define( 'VINE_FRONTEND_URL', 'http://localhost:3000' );      // the Vercel URL in production
define( 'VINE_REVALIDATE_SECRET', 'change-me' );             // must equal REVALIDATE_SECRET on the frontend
```

On publish, update or unpublish, Content posts `{"tags": ["sermons"]}` (or messages,
events, gatherings, testimonials, settings) to `/api/revalidate` on the frontend with the
secret in `X-Vine-Revalidate-Secret`. Left undefined, nothing is sent and the site waits
out its window.

## The submissions user

The Next.js route handlers authenticate to the Events and Forms endpoints with an
[application password](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/).
Give it a user that can do nothing else:

1. Users → Add New. Username `vine-forms`, role **Vine Forms Client**.
2. Open that user, scroll to *Application Passwords*, add one named `vercel`, and copy the
   generated password into `.env.local` as `WORDPRESS_APP_PASSWORD` (spaces included, they
   are part of it).

Application passwords are only offered over HTTPS by default. LocalWP sites are `http://`,
so for development drop this file in the site's `wp-content/mu-plugins/` (not in
`wp-config.php`: the plugin API is not loaded there yet, and the call would fatal):

```php
<?php
// wp-content/mu-plugins/vine-local-dev.php. Development only. Never copy to Bluehost.
add_filter( 'wp_is_application_passwords_available', '__return_true' );
```

Until the password is in `.env.local`, the frontend's route handlers answer every form
as WordPress would but store nothing, and mark the reply `"simulated": true`.

| Form on the site | Route handler | Plugin endpoint |
| --- | --- | --- |
| Footer newsletter | `POST /api/subscribe` | Forms `/subscribe` |
| Contact | `POST /api/enquiry` | Forms `/enquiry` |
| Sunday visitor pass (`/visit`) | `POST /api/visit-plan` | Forms `/visit-plan` |
| Book a place (events, home) | `POST /api/events/{id}/bookings` | Events `/events/{id}/bookings` |

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

And the public reads the website uses, one per entity:

```bash
curl -s -X POST http://vine-house-ministries.local/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ churchEvents { nodes { title eventDate startTime capacity bookedCount remaining bookingStatus } } }"}'
```

```bash
curl -s -X POST http://vine-house-ministries.local/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ sermons { nodes { title sermonFields { speaker sermonDate durationSeconds } sermonSeriesList { nodes { name } } } } }"}'
```

```bash
curl -s -X POST http://vine-house-ministries.local/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ posts { nodes { slug title categories { nodes { name } } messageFields { authorRole readTime } } } }"}'
```

If WPGraphQL for ACF names a field differently from the table above (the `audioFile`
media field is the likeliest), the fix is in the query strings in `lib/wordpress.ts`.

## Cron on Bluehost

Day-before reminders run from WP-Cron, which fires on page views — and a headless site
gets few. On Bluehost, add `define( 'DISABLE_WP_CRON', true );` to `wp-config.php` and a
real cron entry every fifteen minutes:

```
*/15 * * * * php -q /home/<account>/public_html/wp-cron.php >/dev/null 2>&1
```
