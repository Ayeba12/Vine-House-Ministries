# WordPress side of the headless build

WordPress itself is **not** in this repository. It lives in its own LocalWP site during
development and moves to Bluehost with a migration plugin. What *is* versioned here is the
custom code WordPress needs — two plugins — so it can be reviewed, reinstalled and
carried to production like any other source.

```
wordpress/
├── plugins/
│   ├── vine-house-content/   content model: sermons, events, gatherings, testimonials
│   └── vine-house-forms/     submissions: RSVPs, subscribers, enquiries, visit plans
└── README.md
```

## Install into LocalWP

The Local site is expected at `C:\Users\Ayeba\Local Sites\vine-house-ministries`. From
this repository's root, link both plugins so edits here show up in WordPress immediately
(run as Administrator — Windows symlinks need it):

```powershell
$wp = "C:\Users\Ayeba\Local Sites\vine-house-ministries\app\public\wp-content\plugins"
New-Item -ItemType SymbolicLink -Path "$wp\vine-house-content" -Target "$PWD\wordpress\plugins\vine-house-content"
New-Item -ItemType SymbolicLink -Path "$wp\vine-house-forms"   -Target "$PWD\wordpress\plugins\vine-house-forms"
```

Copying the folders works too; you just have to copy again after each change.

Then in wp-admin:

1. Install and activate **WPGraphQL**, **Advanced Custom Fields PRO** and **WPGraphQL for
   ACF**.
2. Activate **Vine House Content**, then **Vine House Forms** (in that order — Forms
   registers a GraphQL field on the Event type that Content defines).
3. ACF picks the field groups up automatically from `vine-house-content/acf-json/`.
   Open *Custom Fields → Field Groups* once so it syncs them; they show as "Sync
   available" if anything on disk is newer than the database.
4. Settings → Permalinks → Save (once) so the new post types get their rewrite rules.

## The submissions user

The Next.js route handlers authenticate to the Forms endpoints with an
[application password](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/).
Give it a user that can do nothing else:

1. Users → Add New. Username `vine-forms`, role **Vine Forms Client** (the plugin creates
   this role; it carries the single capability `vine_submit_forms`).
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

With the plugins active and the password in hand:

```bash
curl -u "vine-forms:xxxx xxxx xxxx xxxx xxxx xxxx" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","frequency":"Weekly Devotional"}' \
  http://vine-house-ministries.local/wp-json/vine/v1/subscribe
```

A `201` with the new record's id means the whole chain works. The record appears under
*Vine Forms → Subscribers* in wp-admin.

Then confirm the privacy boundary — this must return **no** submission types:

```bash
curl -s http://vine-house-ministries.local/wp-json/wp/v2/types | grep -c vh_
```

and this must return an error rather than data:

```bash
curl -s -X POST http://vine-house-ministries.local/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ vhRsvps { nodes { id } } }"}'
```
