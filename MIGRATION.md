# Headless WordPress Migration Plan

Taking the Vine House Ministries frontend from a static AI Studio export with hardcoded
content to a Next.js app on Vercel reading from WordPress, with submissions handled by a
purpose-built plugin.

**Target architecture**

```
LocalWP (dev)  ──►  Bluehost (prod)        Next.js on Vercel
  WordPress            WordPress             ├─ reads content  : WPGraphQL, ISR
  + WPGraphQL          + WPGraphQL           ├─ writes forms   : REST, application password
  + ACF                + ACF                └─ revalidates on  : publish webhook
  + vine-house-forms   + vine-house-forms
        ▲                                            │
        └────────────── POST /wp-json/vine/v1/… ◄────┘
```

---

## What has to change, and why it's in this order

Three constraints drive the sequence:

1. **`output: 'export'` blocks everything.** Static export means no ISR, no route
   handlers, no revalidation. Nothing else can start until it's gone.
2. **All 9 routes are `'use client'`** with content in `useState`. Converting them is the
   bulk of the work, and it can't begin until there's a data layer to convert *to*.
3. **Components use arbitrary values** (`bg-[#2C3E2D]`, `text-[9vw]`) rather than the
   tokens defined in `DESIGN.md`. Token migration is folded into page conversion so each
   file is touched once, not twice.

---

## Phase 0 — Unblock the runtime

Small, self-contained, no WordPress needed yet.

- Remove `output: 'export'` from `next.config.ts`, and the `dist/` copy step from the
  build script.
- Drop `@google/genai` and `firebase-tools` from dependencies (neither is imported;
  `firebase-tools` alone is ~200MB of install time on every CI run).
- Rename the package from `ai-studio-applet` to `vine-house-ministries`.
- Add `images.remotePatterns` for the WordPress host and remove `unoptimized: true`, so
  media served from WP goes through the Next image pipeline.
- Add `.env.example`: `WORDPRESS_GRAPHQL_ENDPOINT`, `NEXT_PUBLIC_WORDPRESS_URL`,
  `WORDPRESS_APP_USER`, `WORDPRESS_APP_PASSWORD`, `REVALIDATE_SECRET`.
- Enable `@typescript-eslint/no-unused-vars`. Dead code accumulates fast during a
  migration, and the current config catches none of it.

**Done when:** `next build` produces server-rendered routes instead of 9 static pages.

---

## Phase 1 — WordPress content model in LocalWP

Create the Local site (suggest `vine-house-ministries`, since `vine-church` holds the
frontend repo). Install WPGraphQL, ACF Pro, and WPGraphQL for ACF.

`lib/types.ts` is already a clean content model — it becomes the ACF field map almost
directly.

| Entity | WP type | Source | Count |
| --- | --- | --- | --- |
| Sermon | CPT `sermon` | `INITIAL_SERMONS` | 4 |
| Event | CPT `church_event` — the events plugin, native meta | `INITIAL_EVENTS` | 4 |
| Gathering pillar | CPT `gathering` | `GATHERING_PILLARS` | 4 |
| Testimonial | CPT `testimonial` | `TESTIMONIALS` | 3 |
| Notice banner | ACF options page | hardcoded in `app/page.tsx` | 1 |

**Sermon** fields: `series`, `speaker`, `speaker_role`, `date`, `duration`,
`audio_duration_seconds`, `scripture`, `summary`, `key_takeaways` (repeater),
`audio_url` (or media), `transcript_snippet`, `tags` (taxonomy), featured image.

**Event** fields live in the events plugin's own meta box, not ACF: `category` (taxonomy:
Worship/Fellowship/Outreach/Study/Youth), date, start and end time, location, room, host,
online link, highlights, and the booking rules — enabled, capacity, max guests per
booking, waitlist, opens/closes. `bookedCount` and `remaining` are **derived** from
bookings, never authored.

**Gathering** fields: `number`, `subtitle`, `timing`, `location`, `tags`.

Decisions worth making deliberately:

- **Dates.** The mock data uses display strings (`"August 16, 2026"`). Store real dates in
  WP and format in the frontend, or sorting and "upcoming events" filtering will never
  work properly.
- **Tags vs taxonomies.** Use real taxonomies so filtering can happen in the GraphQL
  query rather than in client-side JavaScript over a full fetch.
- **Audio.** Sermon audio is currently an external URL. Decide now whether files live in
  the WP media library (simple, counts against Bluehost storage and bandwidth) or on a
  CDN/podcast host (better for a growing sermon archive).

**Done when:** all 15 records exist in WordPress and the GraphQL endpoint returns them.

---

## Phase 2 — The WordPress plugins

Three plugins, versioned under `wordpress/plugins/` and linked into LocalWP:

| Plugin | Owns |
| --- | --- |
| `vine-house-content` | sermons, gatherings, testimonials, site settings — ACF field groups |
| `vine-house-events` | events and bookings: capacity, waitlist, booking window, pass codes, check-in, attendee emails with `.ics`, day-before reminders, office bookings, CSV export |
| `vine-house-forms` | newsletter, enquiries, visit plans |

Events are native meta with their own edit-screen box rather than ACF, so the booking
rules can't be edited away by someone changing a field group. `ChurchEvent` in GraphQL
carries `eventDate`, `capacity`, `bookedCount`, `remaining` and `bookingStatus`; the
frontend renders the booking button from that one status field.

Six forms currently submit into React state and vanish on refresh:

| Form | Location | Shape |
| --- | --- | --- |
| Newsletter | `Footer.tsx:160` | email, frequency |
| RSVP | `RsvpModal.tsx:139` | name, email, phone, guests, first-time flag, notes |
| Plan a visit | `PlanVisitGuide.tsx:227` | name, email, service, party size, children, host request |
| Visitor pass | `app/visit/page.tsx` | name, email, date, service, guests, children's ages |
| Contact | `app/contact/page.tsx:298` | category (general/prayer/sacraments/charity), name, email, message |
| Gathering interest | `app/gatherings/page.tsx:400` | gathering, name, email |

The RSVP form becomes a booking; the other five go to Forms. Both plugins share one
API-only role, so a single application password serves every endpoint.

**Endpoints, all under `/wp-json/vine/v1/`**

| Route | Plugin | Notes |
| --- | --- | --- |
| `POST /events/{id}/bookings` | events | confirmed or waitlisted by capacity; idempotent per email; returns pass code and cancel token |
| `GET /events/{id}/availability` | events | status, remaining, max guests |
| `GET /bookings/{token}` | events | for the "manage my booking" page |
| `POST /bookings/{token}/cancel` | events | promotes the waitlist |
| `POST /subscribe` | forms | idempotent on email |
| `POST /enquiry` | forms | contact and gathering interest, with a category |
| `POST /visit-plan` | forms | plan-a-visit and visitor pass, returns a pass code |

**Rules that matter**

- Submission CPTs are `public => false`, `show_ui => true`. Member data must never be
  queryable through WPGraphQL or the public REST API.
- A custom `manage_vine_submissions` capability granted to Editor and Administrator, so
  the office can see RSVPs without being handed the keys to the whole site.
- Authentication is an application password over HTTPS, called **only** from a Next.js
  route handler. The credentials are server-side environment variables and never reach
  the browser.
- Rate limiting and a honeypot field. A public POST endpoint on a charity site will be
  found by bots.
- Capacity is enforced server-side. The client already shows "26 Seats Available"; only
  WordPress can actually hold the line.
- Email notification per submission, so the office isn't required to log in to discover a
  prayer request.

**Done when:** each endpoint accepts a valid payload, rejects an invalid one, and the
records appear in wp-admin with working CSV export.

---

## Phase 3 — Data layer

`lib/wordpress.ts`, modelled on the pattern already proven in `thrivewell-care`:

- A typed `fetchAPI` with an abort timeout and a GraphQL error path.
- One fetch function per entity, returning the **existing** `lib/types.ts` interfaces, so
  components need no prop changes when the data source swaps.
- `next: { revalidate: 300 }` in production, `no-store` in development.
- A resilient fallback: if WordPress is unreachable at build time, the site builds with
  empty collections rather than failing the deploy. A church site that renders without a
  sermon list beats a site that 500s.

`app/api/revalidate/route.ts` — a secret-guarded endpoint WordPress calls on publish, so
edits appear without waiting out the ISR window.

**Done when:** `lib/data.ts` is unreferenced and can be deleted.

---

## Phase 4 — Page conversion

The pattern for each route: a **server component** fetches and renders the shell; the
interactive parts become **client islands** taking data as props. The audio player,
filters, modals and forms stay `'use client'` — they genuinely need it. Page-level
`useState` holding *content* goes away.

Order, easiest first, so the pattern is proven on low-risk pages:

| # | Route | Data | Client islands | Risk |
| --- | --- | --- | --- | --- |
| 1 | `/gatherings` | gatherings | interest form, borough filter | low |
| 2 | `/about` | testimonials | none | low |
| 3 | `/contact` | none | contact form | low |
| 4 | `/visit` | none | pass generator, map, FAQ | medium |
| 5 | `/events` | events | RSVP modal, calendar | medium |
| 6 | `/sermons` | sermons | filters, search, audio | high |
| 7 | `/` | all | everything | high |

The homepage goes last: it composes every component and holds the audio player state that
persists across the page.

**Fold into each page as it converts:** replace arbitrary Tailwind values with the
`DESIGN.md` tokens, and add `useReducedMotion()` to that page's animated components. One
pass per file.

---

## Phase 5 — Wire the forms

Each form posts to a Next route handler, which calls the plugin with the application
password. Per form: optimistic UI preserved, real error states, disabled submit while
in flight, and a success state that reflects what WordPress actually stored — an RSVP
confirmation should show the pass code the server generated, not one invented client-side.

---

## Phase 6 — Pipeline

- Connect the GitHub repo to Vercel. Root directory `./`, framework Next.js.
- Environment variables per environment: LocalWP endpoint for development, Bluehost for
  preview and production.
- Branch previews on every PR.
- `main` is production. Protect it.

Note: preview deploys can't reach `http://vine-house-ministries.local`. Either point
previews at the Bluehost instance or accept empty-collection fallbacks in preview.

---

## Phase 7 — Bluehost cutover

1. Migrate WordPress with All-in-One WP Migration or Duplicator (database, uploads,
   plugins, the custom plugin included).
2. Enforce HTTPS. Application passwords over plain HTTP leak credentials.
3. Lock down: disable XML-RPC, restrict REST for anonymous users, keep the submission CPTs
   out of public queries.
4. Point `WORDPRESS_GRAPHQL_ENDPOINT` at production, redeploy.
5. Configure the revalidation webhook on the production site.
6. Verify: publish a sermon in wp-admin and confirm it appears on the Vercel site.

WordPress serves no public HTML in this setup — only GraphQL and REST. Worth deciding
whether the WP install sits on a subdomain (`cms.vinehouseministries.org.uk`) and whether
its own frontend is blocked outright.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| Bluehost shared hosting is slow to answer GraphQL | ISR means visitors rarely wait on WP; set a conservative timeout and a fallback |
| Member data (RSVPs, prayer requests) exposed via REST/GraphQL | Private CPTs, capability checks, explicit GraphQL exclusion — verify with an anonymous request before launch |
| Application password leaks to the client | Route handlers only; never `NEXT_PUBLIC_` |
| Homepage conversion breaks audio state | Convert last, after the pattern is proven six times |
| Charity compliance | Charity number and registered details are already in the footer; keep them through the rebuild |

---

## Sequencing summary

Phase 0 is independent and can start now. Phases 1 and 2 are WordPress work that can run
alongside Phase 3's data layer. Phase 4 is the long stretch. Phases 6 and 7 are
deployment, and 7 is the only one that needs the Bluehost account in hand.
