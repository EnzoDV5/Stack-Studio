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
| `/services`   | Services   | Understand: what do I get, for what? | Start with a service, choose a plan |
| `/process`    | Process    | Understand: how does it run?         | Start the brief, compare the plans  |
| `/pricing`    | (redirect) | Old links → `/services#plans` (301)  | —                                   |
| `/studio`     | Studio     | Find and Trust: who is behind it?    | Meet the founders                   |
| `/start`      | Start      | Contact: how do I start?             | WhatsApp, email                     |
| `/privacy`    | Privacy    | POPIA: what happens to my data?      | Back to the brief                   |
| `*`           | 404        | Recovery                             | Home, Start a project               |

Global chrome on every route: skip link, header (logo, Home, Work, Services,
Process, Studio, **Start a project** button), full-screen mobile menu, footer (big CTA, email, WhatsApp,
Instagram, LinkedIn, privacy link).

## Home `/`

Home is a guided summary of the whole site: what visitors need, what we offer, how a project
runs, proof, client feedback and the people behind the work. No prices or full service and
process detail: the other pages do the talking. Each chapter links to its full page.

| #   | Section           | Tone   | Purpose                                                                                                                                                                |
| --- | ----------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| —   | Hero              | dark   | Statement over the showreel, the Stack mark large on the right, **Start a project**                                                                                    |
| 01  | What do you need? | dark   | Four paths as a self-select router (no prices; fixing joins improving, a new home joins care, which opens the plans), then the large technology strip along its bottom |
| 02  | What we do        | paper  | Four editorial service rows linking to the relevant detail on /services                                                                                                |
| 03  | Process           | dark   | A vertical journey from brief through build to ongoing care → /process                                                                                                 |
| 04  | Selected work     | paper  | Pinned sideways reel with each client logo beside its project name → /work                                                                                             |
| 05  | Clients           | paper  | Quotes linked to each project → /work                                                                                                                                  |
| 06  | Studio            | paper  | The two founders, one line each → /studio                                                                                                                              |
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

What we offer. **No project prices** (project estimates open in /start); the monthly plans are
the one place prices appear. Compact page title, then 01 new websites, 02 apps and software
(the phone), 03 desktop software (the laptop), 04 fixing or improving an existing site or app
(quoted by the hour) and 05 hosting and care: the plan cards themselves (`#plans`), with
**How care works** → /process#care beside the title. Every build service opens to a
**Start with this** link (`/start?type=<id>`) and every group ends with a button that opens
the brief on its path. Then the FAQ (general, services and plan questions) and the closing CTA.

A transparent, viewport-height section rail stays at the side on desktop (from 1280px, where the
gutter is wide enough) and becomes a section menu on phones and tablets. It fades out once the
reader is past the last section, so it never sits over the closing CTA or the footer. The page title sits outside the count. Its connected markers show reading
progress, and the current section name animates beside its marker. Hovering or focusing another
marker reveals its name before jumping. Process uses the same navigator.

The three ongoing options have different scopes: **Website Care** includes hosting, one
standard domain and routine upkeep for one site; **Managed Software** includes website and app hosting,
one standard domain, technical upkeep and three small change tickets each month; **Partner** plans, manages and builds
across projects within reserved monthly hours. Partner hosting and domains are separate.
Partner is the orange third card without a fixed price. Its action opens a brief to discuss
the projects and monthly hours.

## Process `/process`

How working with us runs, in the order it happens: what happens once you get in touch (brief →
reply → meeting → fixed quote, **Start the brief**), how a project runs week by week (the
timeline), payment terms (the milestone schedules, launch warranty and ownership), then after
launch: an editorial video and three numbered steps on how care runs (we take it over, keep it
healthy each month, and handle your requests), with **Compare the plans** → /services#plans.
Then the process FAQ and the closing CTA. The old `/pricing` URL redirects to
`/services#plans` (in the app and as a 301 in `public/.htaccess`).

## Studio `/studio`

Compact page title, who we are, the two founders, how we work (principles), our stack (an
interactive diagram of the tools we use, filtered by kind of build), values, closing CTA.

## Start `/start`

A guided brief, one step per screen, with a live estimate panel:
what you need → (new build: website, app or software → project type → scope and ongoing
plan → timeline) / (help with what you have) / (care plan: what we look after) / (partner: a
short description) → contact details (with POPIA consent) → review and submit → success
state. No budget question: the plan prices and the live estimate are already on screen. WhatsApp is offered as an
alternative throughout.

## Privacy `/privacy`

A POPIA-oriented privacy notice (placeholder copy): what we collect through the brief, why,
how long we keep it, and who to contact.
