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
| Message | standard WP `post` with categories — the journal | `MESSAGES` | 5 |
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

| Form | Location | Route handler | Shape |
| --- | --- | --- | --- |
| Newsletter | `components/Footer.tsx` | `/api/subscribe` | email, frequency |
| Book a place | `components/RsvpModal.tsx` | `/api/events/{id}/bookings` | name, email, phone, guests, first-time flag, notes |
| Visitor pass | `app/visit/page.tsx` | `/api/visit-plan` | name, email, service, party size, children |
| Contact | `app/contact/page.tsx` | `/api/enquiry` | category (general/prayer/sacraments/charity), name, email, phone, message |

The booking goes to Events; the other three go to Forms. Both plugins share one API-only
role, so a single application password serves every endpoint. The plan-a-visit guide and
the gatherings page, with their forms, were removed in the redesign.

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

## Phase 3 — Data layer — done

`lib/wordpress.ts`:

- A typed `fetchGraphQL` with an eight-second abort and a GraphQL error path.
- One fetch function per entity (`getSermons`, `getEvents`, `getMessages`, `getMessage`,
  `getGatherings`, `getTestimonials`, `getSiteSettings`), each returning the **existing**
  `lib/types.ts` interfaces, so no component changed when the source swapped.
- `next: { revalidate: 300, tags }` in production, `no-store` in development.
- Source policy: with no `WORDPRESS_GRAPHQL_ENDPOINT` the site runs on the seed content in
  `lib/data.ts`; with one set and WordPress unreachable it renders empty collections and
  logs why. A church site that renders without a sermon list beats a site that 500s.

`app/api/revalidate/route.ts` takes `{ tags: [...] }` behind `REVALIDATE_SECRET` and
clears the tags and the pages they reach. Vine House Content sends it on publish when
`VINE_FRONTEND_URL` and `VINE_REVALIDATE_SECRET` are defined in `wp-config.php`.

`lib/data.ts` stays as the seed until the WordPress content exists; then it goes.

---

## Phase 4 — Page conversion

The pattern for each route: a **server component** fetches and renders the shell; the
interactive parts become **client islands** taking data as props. The audio player,
filters, modals and forms stay `'use client'` — they genuinely need it. Page-level
`useState` holding *content* goes away.

Order, easiest first, so the pattern is proven on low-risk pages:

| # | Route | Data | Client island | Status |
| --- | --- | --- | --- | --- |
| 1 | `/messages` and `/messages/[slug]` | posts | `MessagesView`, `MessageView` | done |
| 2 | `/events` | events | `EventsView` (search, tabs, booking modal) | done |
| 3 | `/sermons` | sermons | `SermonsView` (filters, search, audio) | done |
| 4 | `/` | sermons, events, gatherings, testimonials, settings | `HomeView` (player, booking modal) | done |
| 5 | `/about`, `/contact`, `/visit` | none | the whole page | still client pages; no content to fetch |

Each converted route is a server `page.tsx` that fetches, plus a `*View.tsx` client island
that took the old page's body unchanged with the data as props. `GatheringsGrid` and
`VoicesSection` take `pillars` and `testimonials` from the home page; the notice banner
and the footer's service times come from Site Settings.

**Fold into each page as it converts:** replace arbitrary Tailwind values with the
`DESIGN.md` tokens, and add `useReducedMotion()` to that page's animated components. One
pass per file.

---

## Phase 5 — Wire the forms — done

Each form posts to a Next route handler (`app/api/*`), which calls the plugin with the
application password through `lib/wp-rest.ts`. Per form: disabled submit while in
flight, the plugin's own error message shown beside the action, and a success state that
reflects what WordPress stored — the booking shows the pass code and the confirmed or
waitlisted status the server returned. Until `WORDPRESS_APP_PASSWORD` is set, the
handlers answer as WordPress would and mark the reply `simulated: true`.

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
