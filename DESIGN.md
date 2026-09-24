# Vine House Ministries — Design System

A contemporary sanctuary: warm, reverent, welcoming, spiritually grounded, confidently modern.

This document governs every visual decision in the frontend. Tokens live in
[`app/globals.css`](app/globals.css); fonts are loaded in [`app/layout.tsx`](app/layout.tsx).
If something here and the code disagree, the code is the bug.

---

## 1. Principles

1. **Stillness over spectacle.** The brand argument is reverence and quiet. Motion is
   slow and minimal; nothing bounces, pulses or demands attention.
2. **Architectural, not decorative.** Structure carries the design — the 48px grid,
   monolithic dark blocks, generous negative space, numbered sections (01–04).
3. **Warmth without softness.** Warm sand and olive keep it human; sharp type and
   hard edges keep it serious. Avoid pastel, glow, and rounded-everything.
4. **Legible to everyone.** This is a registered charity serving a public
   congregation, including older members. Contrast and motion rules are not optional.

---

## 2. Colour

### 2.1 Primitives

Raw brand values. **Never reference these directly in components** — use the semantic
tokens in §2.3.

| Token | Hex | Name |
|---|---|---|
| `--color-sanctuary-olive` | `#2C3E2D` | Sanctuary Olive |
| `--color-warm-sand` | `#F9F7F2` | Warm Sand |
| `--color-deep-slate` | `#1E242B` | Deep Slate |
| `--color-muted-sage` | `#8A9A86` | Muted Sage |
| `--color-soft-honey` | `#D4A373` | Soft Honey |

### 2.2 The contrast constraint

Measured WCAG 2.1 contrast ratios against Warm Sand `#F9F7F2`:

| Colour | Ratio on sand | Body text (4.5:1) | Large text (3:1) |
|---|---|---|---|
| Deep Slate | 14.61:1 | pass | pass |
| Sanctuary Olive | 10.69:1 | pass | pass |
| Muted Sage | **2.78:1** | **fail** | **fail** |
| Soft Honey | **2.11:1** | **fail** | **fail** |

And against the dark grounds:

| Colour | on Olive | on Slate |
|---|---|---|
| Warm Sand | 10.69:1 | 14.61:1 |
| Soft Honey | 5.06:1 | 6.92:1 |
| Muted Sage | **3.84:1 — fails** | — |

**Neither accent swatch is a text colour.** Honey carries the brand on olive and slate but
is unreadable on sand; sage falls below AA on *both* grounds. This drives the token
structure below: text tokens are named by the ground they sit on and re-tinted until they
pass there, so the failing combinations become hard to express by accident.

Re-tinted equivalents, derived to clear AA on their own ground:

| Token | Hex | Ratio | Use |
|---|---|---|---|
| `--accent-on-light` | `#9B6530` | 4.56:1 on sand | any size |
| `--accent-on-light-large` | `#C4803E` | 3.02:1 on sand | 24px+ only |
| `--ink-on-light-muted` | `#667662` | 4.53:1 on sand | any size |
| `--ink-on-dark-muted` | `#B2BDB0` | 5.89:1 on olive | any size |

### 2.3 Semantic tokens

**Light ground** — warm sand pages, white cards:

| Token | Value | Use |
|---|---|---|
| `--surface-light` | `#F9F7F2` | page background |
| `--surface-light-raised` | `#FFFFFF` | cards, panels |
| `--surface-light-tint` | `#F3EFE6` | alternating bands |
| `--ink-on-light` | `#1E242B` | body copy |
| `--ink-on-light-strong` | `#2C3E2D` | headings |
| `--ink-on-light-muted` | `#667662` | captions, metadata |
| `--accent-on-light` | `#9B6530` | links, eyebrows, small caps |
| `--accent-on-light-large` | `#C4803E` | 24px+ accent text only |
| `--border-on-light` | `rgba(138,154,134,.35)` | hairlines, card borders |

**Dark ground** — olive and slate monoliths:

| Token | Value | Use |
|---|---|---|
| `--surface-dark` | `#2C3E2D` | olive blocks |
| `--surface-dark-deep` | `#1E242B` | slate blocks, footer |
| `--ink-on-dark` | `#F9F7F2` | body and headings |
| `--ink-on-dark-muted` | `#B2BDB0` | metadata, any size |
| `--accent-on-dark` | `#D4A373` | eyebrows, highlights, active states |
| `--border-on-dark` | `rgba(212,163,115,.25)` | hairlines |

### 2.4 Rules

- Every foreground **must** pair with a token from its own ground. Honey on sand, and sage
  on either ground, are defects rather than style choices.
- Accent colour never carries meaning alone — pair with text, weight or an icon.
- Dark blocks are structural punctuation. Roughly one per two light sections;
  consecutive dark blocks flatten the rhythm.

### 2.5 Logo marks

Four single-colour PNG marks were supplied. Their fills, sampled from the files:

| Token | Hex | on sand | on olive | Ground |
|---|---|---|---|---|
| `--color-logo-green` | `#0B420F` | 10.89:1 | 1.02:1 | light only |
| `--color-logo-green-bright` | `#178C20` | 4.08:1 | 2.62:1 | light only |
| `--color-logo-gold` | `#D1A259` | 2.17:1 | 4.92:1 | dark only |

**Green on light, gold on dark, never crossed.** The deep green vanishes on olive and the
gold vanishes on sand. Navigation on warm sand takes the deep green; the footer on slate
takes the gold.

The logo greens sit at hue 124° and Sanctuary Olive at 123°: the site palette is the
brand desaturated (71% → 17%), which makes the mark the one vivid element on any page.
That relationship is intentional — don't pull the UI palette toward the logo, and don't
use these three tokens for anything but the mark itself. The gold is close enough to
Soft Honey to be mistaken for it; it isn't the same colour.

Vector originals have not been supplied. Request them before favicon or print use.

---

## 3. Typography

### 3.1 Faces

| Role | Face | Loaded as |
|---|---|---|
| Display | **Anton** 400 | `next/font/google` → `--font-anton-src` |
| Body | **DM Sans** variable | `next/font/google` → `--font-dm-sans-src` |

Consumed through `--font-anton` / `--font-dm-sans`, with `Impact` and system sans as
fallbacks. Self-hosted by `next/font` — no external Google Fonts request, no layout
shift beyond the `swap` window.

Anton is **display only**: headings, numerals, wordmarks. It has one weight, tight
apertures and no italic. Never set body copy, form labels or anything below ~24px in
Anton. Always pair with `letter-spacing: -0.02em` (the `.font-anton` class does this).

### 3.2 Fluid scale

Nine steps, minor third (1.2) at 320px widening to a perfect fourth (1.333) at 1280px.
Mobile stays readable; desktop display sizes stay dramatic. No breakpoint jumps.

| Utility | Token | 320px | 1280px | Use |
|---|---|---|---|---|
| `.scale-step-caption` | `--type-step-minus-1` | 13.3px | 13.5px | eyebrows, metadata |
| `.scale-step-body` | `--type-step-0` | 16px | 18px | body copy |
| `.scale-step-lead` | `--type-step-1` | 19.2px | 24px | intros, pull quotes |
| `.scale-step-h5` | `--type-step-2` | 23px | 32px | card titles |
| `.scale-step-h4` | `--type-step-3` | 27.6px | 42.7px | sub-headings |
| `.scale-step-h3` | `--type-step-4` | 33.2px | 56.9px | section headings |
| `.scale-step-h2` | `--type-step-5` | 39.8px | 75.8px | major headings |
| `.scale-step-h1` | `--type-step-6` | 47.8px | 101.1px | page titles |
| `.scale-step-display` | `--type-step-7` | 57.3px | 134.8px | hero only |

**Prefer these utilities over arbitrary Tailwind sizes** (`text-[9vw]`, `text-5xl`).
Arbitrary values are how the scale drifts.

### 3.3 Measure and rhythm

- Body copy caps at `70ch` (set globally on `p`). Don't override.
- Body line-height 1.625; display line-height 1.0–1.15, tightening as size grows.
- Eyebrow labels: caption step, uppercase, `letter-spacing: 0.1em`, accent colour.

---

## 4. Layout

- **Grid:** 48px architectural grid (`.arch-grid`, `.arch-grid-dark`). All major
  spacing should land on multiples of 8, ideally 48 for section rhythm.
- **Container:** `max-w-7xl` with `px-5 sm:px-8 lg:px-12` gutters.
- **Section padding:** `py-24 sm:py-32`.
- **Radii:** `rounded-xl` for cards and buttons, `rounded-lg` for inputs and chips.
  Nothing fully rounded except avatars and the audio scrubber thumb.
- **Elevation:** shadows are near-invisible by design (`shadow-2xs`, `shadow-xs`).
  Depth comes from ground colour changes and hairline borders, not drop shadows.
  **The one exception is a floating menu** — the `Select` list, and anything else that
  opens over the page — which has to read as floating, and a hairline on sand cannot do
  that alone. It takes `0 8px 24px rgba(30, 36, 43, 0.12)`, the only shadow of any weight
  on the site. Nothing that sits *in* the page gets it.

---

## 5. Motion

| Token | Value | Use |
|---|---|---|
| `--motion-duration-fast` | 150ms | hovers, focus rings |
| `--motion-duration-base` | 250ms | buttons, cards, drawers |
| `--motion-duration-slow` | 600ms | scroll reveals |
| `--motion-ease` | `cubic-bezier(.22,1,.36,1)` | everything |

Scroll reveals are a 20px rise with a fade, `viewport={{ once: true }}`. Once only —
elements never re-animate on scroll-back.

**Reduced motion is mandatory.** `globals.css` neutralises every CSS transition and
animation under `prefers-reduced-motion: reduce`. JS-driven reveals must *also* call
`useReducedMotion()` from `motion/react` and skip the transform, because inline
`animate` values bypass CSS. A reveal that hides content until an animation runs is a
content-blocking bug for anyone with the setting on.

---

## 6. Components

- **Buttons.** Primary: olive fill, sand text. Secondary: white fill, hairline border,
  olive text. Accent: honey fill, slate text — dark ground only. All get
  `active:scale-[0.98]` and a visible focus ring.
- **Cards.** White surface, hairline border, `rounded-xl`, image at 16:9, eyebrow +
  title + meta row. Numbered variants carry the index top-right in Anton.
- **Forms.** Labels in caption step, uppercase, muted ink. Inputs `rounded-lg` with
  hairline borders. Never communicate errors by colour alone.
- **Focus.** Every interactive element needs a visible focus-visible ring — honey on
  dark grounds, olive on light. Never remove the outline without replacing it.

---

### 6.1 Primitives in code

`app/globals.css` carries the recurring pieces so every section draws them the same way:

| Class | What it is |
|---|---|
| `.eyebrow` | caption step, uppercase, 0.12em tracking, semibold - section labels |
| `.meta` | caption step, sentence case - dates, places, counts |
| `.col-rules` / `.col-rules-dark` | four faint vertical rules across the container |
| `.btn` + `.btn-primary` / `.btn-outline` / `.btn-on-dark` / `.btn-outline-on-dark` | the two button weights, per ground |
| `.link-arrow` | uppercase text link with a bottom rule, paired with an arrow glyph |

Semantic colours are also Tailwind utilities (`bg-surface`, `text-ink-muted`, `border-hairline`,
`text-accent-on-dark`...). A component that writes a hex value is a defect.

`components/ui/Reveal.tsx` is the only scroll reveal. It renders a plain element under
`prefers-reduced-motion`; anything else that animates calls `useReducedMotion()` itself.

---

## 7. Accessibility floor

Non-negotiable, and checkable:

1. Text meets AA (4.5:1 body, 3:1 for 24px+). Use §2.3 tokens and it holds by default.
2. `prefers-reduced-motion` honoured in both CSS and JS.
3. Every image has meaningful `alt`, or `alt=""` if decorative.
4. Heading levels descend without skipping.
5. Keyboard reachable in visible order; focus never invisible.
6. Touch targets at least 44×44px.
7. Colour is never the only signal.

---

## 8. Content voice

Reverent, plain, welcoming. Say "Plan your visit", not "Get started". Scripture is
cited as `John 15:1–8` with an en dash. Dates spell the month. British English
throughout — "programme", "neighbour", "organisation".

Avoid: hype verbs, exclamation marks, corporate church jargon, and anything that
reads as a growth funnel. The site should sound like a person offering a seat.

---

## 9. Rules

**Do**
- Use semantic colour tokens named for their ground.
- Use `.scale-step-*` utilities for type.
- Keep spacing on the 8/48 grid.
- Add `useReducedMotion()` to every animated component.

**Don't**
- Use the raw brand swatches as text on any ground.
- Set Anton below 24px, or use it for body copy.
- Introduce a new colour, radius or shadow without adding it here first.
- Use arbitrary Tailwind type sizes when a scale step exists.
- Animate anything without a reduced-motion path.
