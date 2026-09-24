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

| #   | Section          | Tone   | Purpose                                                        |
| --- | ---------------- | ------ | -------------------------------------------------------------- |
| —   | Hero             | dark   | Big statement over the showreel; magnetic **Start a project**  |
| —   | Technology strip | dark   | Tools across design, development, infrastructure and AI        |
| 01  | Selected work    | paper  | Two featured case studies, large media, hover video previews   |
| 02  | Services         | dark   | Expanding rows: what we do, each with a "from" price and a CTA |
| 03  | Process          | paper  | Pinned sticky-scroll: how a project runs, week by week         |
| 04  | Pricing teaser   | dark   | Project "from" prices, plus the monthly plan hook              |
| 05  | Studio snippet   | paper  | The two founders, one line each                                |
| —   | Testimonial      | paper  | A real client voice                                            |
| —   | Closing CTA      | orange | Giant **Start a project**                                      |

## Work `/work`

Compact page title, then a filter bar (All plus categories, stored in `?filter=` so it can be linked),
then the project grid (hover video preview on desktop), then the closing CTA.

## Case study `/work/:slug`

One template, driven entirely by `src/data/projects.ts`:

1. Compact page title and summary (project imagery remains in the gallery)
2. Meta: client, year, services, live link
3. Narrative: 01 Problem, 02 Approach, 03 Build, 04 Result
4. Gallery
5. Result metrics
6. Client testimonial, if one exists
7. **Start a project like this** (pre-fills the brief's project type)
8. Next project link (loops back to the first)

Seeded with GC Solar, MPG Foundation and one clearly labelled sample project.

## Services `/services`

Compact page title, service details (what it is, deliverables, typical timeline, "from" price, a
**Start with this** link that pre-fills the brief), the pinned process section, an FAQ
accordion, then the closing CTA.

## Pricing `/pricing`

Compact page title, then two models side by side: **Project builds** (once-off) and **Monthly plans**
(hosting, care, growth). Then the add-ons table, an estimator nudge ("Get an estimate in
two minutes"), the pricing FAQ and the closing CTA. Everything comes from
`src/data/pricing.ts`.

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
