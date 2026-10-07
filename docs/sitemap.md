# Sitemap

Every page ends by pushing toward one main action: **Start a project** (`/start`).
Section numbers are the eyebrow labels shown on the page (`01 · WORK`). Tone is the
background used for rhythm: `dark` (ink #0A0A0A), `paper` (#F4F0EA) or `orange` (the one
closing CTA band per page).

| Route         | Page       | Main doubt it removes                | Secondary actions                   |
| ------------- | ---------- | ------------------------------------ | ----------------------------------- |
| `/`           | Home       | Find: who are you?                   | Pick a stage, see the work          |
| `/work`       | Work       | Trust: can you actually do this?     | Filter projects, open a case study  |
| `/work/:slug` | Case study | Trust: proof, in detail              | Visit the live site, next project   |
| `/services`   | Services   | Understand: what do I get, how?      | Start with a service, see pricing   |
| `/pricing`    | Plans      | Understand ongoing options and terms | Compare care plans, discuss Partner |
| `/studio`     | Studio     | Find and Trust: who is behind it?    | Meet the founders                   |
| `/start`      | Start      | Contact: how do I start?             | WhatsApp, email                     |
| `/privacy`    | Privacy    | POPIA: what happens to my data?      | Back to the brief                   |
| `*`           | 404        | Recovery                             | Home, Start a project               |

Global chrome on every route: skip link, header (logo, Work, Services, Plans, Studio,
**Start a project** button), full-screen mobile menu, footer (big CTA, email, WhatsApp,
Instagram, LinkedIn, privacy link).

## Home `/`

Home answers "who are you, and can you do it?": what visitors need (and the stack behind the
work), a package to start from, proof, client feedback and who we are. The package rows show
indicative ranges; care plans live on /pricing and project estimates open in /start. The week-by-week process is on /services. Each section ends with a "go deeper"
link so visitors choose where to go. About 10 viewports on desktop.

| #   | Section           | Tone   | Purpose                                                                                                                                                                |
| --- | ----------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| —   | Hero              | dark   | Statement over the showreel, the Stack mark large on the right, **Start a project**                                                                                    |
| 01  | What do you need? | dark   | Four paths as a self-select router (no prices; fixing joins improving, a new home joins care, which opens the plans), then the large technology strip along its bottom |
| 02  | Packages          | dark   | Website packages with indicative ranges in disclosure rows beside a laptop; build an estimate → /start                                                                 |
| 03  | Selected work     | paper  | Pinned sideways reel with each client logo beside its project name                                                                                                     |
| 04  | Clients           | paper  | Quotes linked to each project → /work                                                                                                                                  |
| 05  | Studio            | paper  | The two founders, one line each → /studio                                                                                                                              |
| —   | Closing CTA       | orange | Headline with moving code inside its letterforms, **Start a project**                                                                                                  |

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

What we do, how a project runs and how to start. **No prices**: project estimates open in /start, and ongoing plans live on /pricing. Compact page
title, then 01 new websites,
02 apps and software (the phone), 03 desktop software (the laptop), then 04 fixing or improving
an existing site or app (quoted by the hour) and 05 hosting and care (the plans only:
Website Care, Managed Software and Partner). Every build service opens to a **Start with this** link (`/start?type=<id>`) and
every group ends with a button that opens the brief on its path, except hosting and care,
which opens the monthly plans on /pricing. Then how a project runs (the week-by-week timeline, ending
with **See what it costs** → /pricing), what happens once you get in touch (brief → reply →
meeting → fixed quote), the FAQ and the closing CTA.

A transparent, viewport-height section rail stays at the side on desktop and becomes a section
menu on phones. The page title sits outside the count. Its connected markers show reading
progress, and the current section name animates beside its marker. Hovering or focusing another
marker reveals its name before jumping.
Pricing uses the same navigator.

The three ongoing options have different scopes: **Website Care** includes hosting, one
standard domain and routine upkeep for one site; **Managed Software** includes website and app hosting,
one standard domain, technical upkeep and three small change tickets each month; **Partner** plans, manages and builds
across projects within reserved monthly hours. Partner hosting and domains are separate.
Partner has an orange third card on Plans without a fixed price. A comparison above the
cards explains Partner alongside Website Care and Managed Software. Its action opens a
brief to discuss the projects and monthly hours.

## Plans `/pricing`

The page starts with How it works: an editorial video and three numbered steps on how ongoing
care runs (we take it over, keep it healthy each month, and handle your requests). The detailed
cards for Website Care, Managed Software and Partner follow, each showing what is included and
excluded. Payment terms, common questions and the closing CTA
follow. The Home package showcase keeps indicative project ranges and sends visitors to
the brief for a project estimate. The existing `/pricing` URL stays in place for old links.

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
