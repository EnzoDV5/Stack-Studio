# Sitemap

Every page ends by pushing toward one main action: **Start a project** (`/start`).
Section numbers are the eyebrow labels shown on the page (`01 · WORK`). Tone is the
background used for rhythm: `dark` (ink #0A0A0A), `paper` (#F4F0EA) or `orange` (the one
closing CTA band per page).

| Route         | Page       | Main doubt it removes             | Secondary actions                        |
| ------------- | ---------- | --------------------------------- | ---------------------------------------- |
| `/`           | Home       | Find: who are you?                | See the work, see pricing                |
| `/work`       | Work       | Trust: can you actually do this?  | Filter projects, open a case study       |
| `/work/:slug` | Case study | Trust: proof, in detail           | Visit the live site, next project        |
| `/services`   | Services   | Understand: what do I get?        | Read the FAQ, see pricing                |
| `/pricing`    | Pricing    | Understand: what does it cost?    | Compare build and monthly plans, add-ons |
| `/studio`     | Studio     | Find and Trust: who is behind it? | Meet the founders                        |
| `/start`      | Start      | Contact: how do I start?          | WhatsApp, email                          |
| `/privacy`    | Privacy    | POPIA: what happens to my data?   | Back to the brief                        |
| `*`           | 404        | Recovery                          | Home, Start a project                    |

Global chrome on every route: skip link, header (logo, Work, Services, Pricing, Studio,
**Start a project** button), full-screen mobile menu, footer (big CTA, email, WhatsApp,
Instagram, LinkedIn, privacy link).

## Home `/`

Home is a fast summary of everything, told in order: what visitors need, how Stack works,
what it costs, proof, client feedback and who we are. Each section ends with a "go deeper" link so
visitors choose where to go. About 11 viewports on desktop.

| #   | Section           | Tone   | Purpose                                                                               |
| --- | ----------------- | ------ | ------------------------------------------------------------------------------------- |
| —   | Hero              | dark   | Statement over the showreel, the Stack mark large on the right, **Start a project**   |
| 01  | Where are you at? | dark   | The five stages as a self-select router: key prices, See details, Get an estimate     |
| 02  | Process           | dark   | The six steps along one line, then the technologies strip → /services#process         |
| 03  | Pricing           | paper  | Three "from" figures (website, care, partner), VAT note, Build my estimate → /pricing |
| 04  | Selected work     | paper  | Pinned sideways reel with each client logo beside its project name                    |
| 05  | Clients           | paper  | Quotes linked to each project → /work                                                 |
| 06  | Studio            | paper  | The two founders, one line each → /studio                                             |
| —   | Closing CTA       | orange | Headline with moving code inside its letterforms, **Start a project**                 |

## Work `/work`

Compact page title, then a filter bar (All plus one filter per project, stored in `?filter=` so it can be linked),
then the project grid (hover video preview on desktop), then the closing CTA.

## Case study `/work/:slug`

One template, driven entirely by `src/data/projects.ts`:

1. Compact page title and summary
2. Meta: client, year, services, live link
3. The site on a laptop (`project.screen`, a full-page desktop screenshot; falls back to the
   hero image): the screen swings up and grows toward you, then the whole site scrolls
   inside it
4. Narrative: 01 Problem, 02 Approach, 03 Build, 04 Result
5. Gallery
6. Result metrics
7. Client testimonial, if one exists
8. **Start a project like this** (pre-fills the brief's project type)
9. Next project link (loops back to the first)

Seeded with GC Solar, MPG Foundation and one clearly labelled sample project.

## Services `/services`

Compact page title, service details (what it is, deliverables, typical timeline, "from" price, a
**Start with this** link that pre-fills the brief), the pinned process section, an FAQ
accordion, then the closing CTA.

## Pricing `/pricing`

No fixed price list: quotes are built on `/start`. Compact page title, then how pricing works
(estimate → call → fixed quote), then **starting quotes**: ready-made quotes (launch,
bookings, content and leads, online store, brand experience) showing the range the
estimator computes, each opening `/start?quote=<id>` pre-filled, plus "Something else?"
for everything else. Then the monthly plans, what plans cover, payment terms, the pricing
FAQ and the closing CTA. Starting quotes live in `src/data/quotes.ts`; prices in
`src/data/services.ts`, `plans.ts` and `addons.ts`.

## Studio `/studio`

Compact page title, who we are, the two founders, how we work (principles), values, closing CTA.

## Start `/start`

A guided brief, one step per screen, with a live estimate panel:
project type → scope → features and ongoing plan → timeline → budget → contact details
(with POPIA consent) → review and submit → success state. WhatsApp is offered as an
alternative throughout.

## Privacy `/privacy`

A POPIA-oriented privacy notice (placeholder copy): what we collect through the brief, why,
how long we keep it, and who to contact.
