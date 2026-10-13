# Stack Studio pricing and service model

**This document is the source of truth for the offer.** The data in `src/data/services.ts`,
`plans.ts`, `rates.ts`, `policies.ts`, `addons.ts` and `brief.ts` implements it. Change it
here first, then in the data.

> **Public bundle rule:** no internal hourly cost, margin or contingency logic lives anywhere
> in `src/`. The JavaScript bundle is public. Only client-facing prices belong in the data.

## Public hourly rates

- **Software and development:** R400/hour.
- **Care, maintenance and support:** R200/hour during working hours.
- Every Build starting estimate is calculated from estimated working hours at R400/hour.
  Custom software uses that same rate across web, mobile, desktop, backend, API, AI and
  automation work; the site shows the estimated project cost rather than only the rate.

## Positioning

- **Tagline:** "We build, manage and grow the digital systems your business depends on."
- **Subline:** "Starting something new or need someone to take over what you already have?
  Stack handles both."
- Cinematic websites stay the lead proof on Home; software is the second layer.
- All amounts are in ZAR.

## Five stages

| #   | Stage     | Line                                           |
| --- | --------- | ---------------------------------------------- |
| 01  | Build     | We create it.                                  |
| 02  | Take over | Already built? We'll take it from here.        |
| 03  | Run       | We keep it working.                            |
| 04  | Improve   | Update, extend or redesign what you have.      |
| 05  | Partner   | We become part of your development capability. |

Every offering and plan has a `visibility`:

- `pricing`: shown on the Pricing and Services pages.
- `services`: Services page only. Build items show their calculated starting estimate;
  takeover items are labelled "Quoted per project".
- `hidden`: kept in data, never rendered.

## 01 Build (once-off)

| Offering                      | From     | Visibility | Notes                                                               |
| ----------------------------- | -------- | ---------- | ------------------------------------------------------------------- |
| Business Website              | R18,000  | pricing    | 5 pages included                                                    |
| Custom / Immersive Website    | R35,000  | pricing    | 8 pages included                                                    |
| E-commerce Website            | R45,000  | pricing    | 5 content pages plus the store; complex stores quoted separately    |
| Web Apps & MVPs               | R75,000  | pricing    | 187.5 estimated hours; requires discovery                           |
| Custom Software & Mobile Apps | R120,000 | pricing    | 300 estimated hours; requires discovery                             |
| AI & Automation               | R15,000  | pricing    | Automation from R15k, AI features from R20k, AI platforms from R75k |
| Backend & API Development     | R30,000  | services   | 75 estimated hours                                                  |
| Desktop Applications          | R80,000  | services   | 200 estimated hours                                                 |
| Software Discovery & Scoping  | R7,500   | pricing    | 18.75 estimated hours; required before any build of R120k+          |
| Large-Scale Software Platform | R250,000 | hidden     | 625 estimated hours; scoped individually                            |

- **Business Website** includes custom UX/UI, responsive desktop + mobile, front-end
  development, contact forms, basic animations, basic SEO, Google Analytics, deployment,
  basic CMS if required, and 30-day launch support. "Not a template. A properly designed and
  developed business website."
- **Custom / Immersive** includes custom UX/UI, advanced responsive layouts, GSAP
  interactions, scroll animation, interactive sections, custom CMS, API integrations,
  advanced forms and custom backend functionality.
- **E-commerce** includes a custom storefront, products, categories, cart, checkout,
  payment gateway, customer accounts, order management, CMS, email notifications,
  analytics, and hosting/deployment.
- **Web Apps & MVPs**
  - Examples: client portals, booking systems, dashboards, SaaS products, membership and
    management platforms, customer portals.
  - Includes: accounts, authentication, roles, dashboards, database, backend, APIs,
    payments, notifications, admin system, reporting.
- **Custom Software & Mobile Apps**
  - Examples: CRM, inventory, staff management, job tracking, quoting and workflow
    systems, business dashboards, internal platforms, iOS/Android apps.
  - Includes: frontend, backend, database, auth, roles, APIs, integrations, Docker,
    deployment, hosting, push notifications, payments, maps, uploads, admin dashboard.
- **AI & Automation**
  - Automations: website→CRM, form→database, system→WhatsApp, CRM→email,
    accounting→dashboard, payment gateway→customer account.
  - AI features: AI search, document analysis, internal and customer-support assistants,
    AI on business data, summarisation, extraction, classification, automated workflows,
    RAG.
  - AI/API usage is billed separately.
  - Positioning: "We add useful AI features to the systems we build or the ones you
    already use." Never call Stack an "AI agency".
- **Backend & API**: REST APIs, auth, business logic, roles, SQL/NoSQL, file storage,
  admin systems, server functions, third-party integrations, Docker, deployment. Never
  priced per technology.
- **Desktop Applications**: inventory, internal tools, data management, booking, admin
  systems, offline/online hybrid.
- **Discovery** covers requirements, users, roles, features, database, integrations,
  architecture, wireframes, technical approach, timeline and full development estimate.

## 02 Take over

| Offering                | From    | Visibility | Notes                                                                                                              |
| ----------------------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| Website Technical Audit | R2,500  | pricing    | Technical Health Report (Good / Needs attention / Critical); fee credited against a takeover signed within 30 days |
| App / Software Audit    | R5,000  | services   | Large systems: custom quote                                                                                        |
| Website Takeover        | R3,500  | services   | Then the client moves onto a Care plan                                                                             |
| Software / App Takeover | R10,000 | services   | Then the client moves onto Managed or Partner                                                                      |

- **Website audit** checks source code, framework, hosting, domain/DNS, SSL, performance,
  security, dependencies, database, backups, analytics, repository access and deployment.
- **App audit** covers frontend, backend, database, code quality, security, hosting,
  architecture, dependencies, deployment, documentation, backups and third-party services.
- **Website takeover** covers repository move, Stack access, hosting, domain/DNS, backups,
  deployment, analytics, monitoring, documentation and environment config.
- **Software takeover** covers repository migration, environment setup, database access,
  infrastructure review, deployment pipeline, monitoring, backups, documentation and
  critical fixes.

## 03 Run (monthly, 3-month minimum, billed in advance)

Care is for one website; Managed adds one standard app and a small monthly change allowance. Both have a single public price. Partner appears beside them as a conversation-led option with a tailored quote.

| Plan                        | Price              | Change allowance                | Visibility |
| --------------------------- | ------------------ | ------------------------------- | ---------- |
| Website Care Essential      | R700/month         | Routine upkeep only             | pricing    |
| Managed Software            | R3,600/month       | 3 small requests, up to 1h each | pricing    |
| Mission-Critical Management | from R20,000/month | Quoted separately               | hidden     |
| Website Hosting only        | from R450/month    | None                            | hidden     |
| App Hosting only            | from R1,500/month  | None                            | hidden     |

- **Website Care Essential:** R450 website hosting + one hour of routine business support at
  R200/hour + R50/month for one standard domain registration or renewal up to R600/year.
  Includes SSL, DNS, backups, uptime checks, security updates and routine fixes. Content
  and design changes are quoted separately.
- **Managed Software:** R450 website hosting + R1,500 standard app hosting + R50/month for
  one standard domain up to R600/year + two hours of routine technical care at R200/hour +
  three small change tickets of up to one hour each at R400/hour. Total: R3,600/month.
  Includes monitoring, backups, security updates and deployments. A ticket is one small
  change, not a new feature; larger work is quoted separately.
- The fixed prices cover standard hosting for one website (Care) or one website and one app
  (Managed). Extra cloud capacity and third-party usage are agreed before billing.
- **Mission-Critical** is quoted on users, traffic, infrastructure, risk, response time,
  database size and integrations.
- **Hosting-only plans** remain available on request. They are not the public care packages.

## 04 Improve

- For an existing website or app that needs updates, new pages, added features,
  integrations, UX/UI improvements, or a partial or full redesign.
- Work is estimated at R400/hour and presented as an estimated-hours quote before it starts.
- Once the changes are live, Website Care or Managed Software can be added as a fixed
  monthly bundle.

## 05 Partner (tailored monthly quote)

- **Partner work:** planning, design, development and ongoing management across projects.
  This can include creating and managing an AI tool, building software, or managing several
  existing products. The projects, scope, monthly hours and price are agreed in conversation.
- Pricing shows an orange Partner card without a numeric price. Its action opens the Partner
  enquiry (`/start?path=develop`): a short description of what we'd work on together, then
  contact details. The brief does not calculate a Partner price. Old fixed plan and
  `?partner=` links open the same enquiry.
- Hosting, domains and third-party usage are included only when agreed in the tailored scope.

## Policies (Pricing page and /terms)

- **Projects under R50,000:** 50% to start, 30% at the design/development milestone, 20%
  before launch.
- **Larger projects:** 30% to start, 30% at core system, 30% at feature complete, 10% at
  deployment.
- **Monthly plans:** billed monthly in advance, 3-month minimum. Managed change requests
  reset each month. Unused Partner hours roll over one month, then expire. Support during
  business hours (SAST).
- **Annual prepay (optional):** 12 months for the price of 11.
- **Third-party costs:** base hosting is included in Care and Managed. Partner hosting is
  separate. Extra cloud capacity, AI/API usage, email, SMS and storage are agreed first
  and billed at cost.
- **Domains:** Website Care and Managed Software each include one standard registration or renewal up to R600/year.
  Extra or premium domains are billed at cost.
- **30-day launch warranty:** every new build includes bug fixes on what Stack built. No
  new features.
- **Monthly care is not unlimited work.**
  - Website Care covers routine upkeep. Managed Software adds three small change requests.
  - New functionality, redesigns, major integrations and work beyond the Managed allowance
    are quoted separately or planned through Partner hours.
- **IP:** transfers to the client on final payment.
- **VAT:** "Prices exclude VAT where applicable." (To confirm: VAT registration status.)

## Add-ons (website builds only)

| Add-on                                   | Price       |
| ---------------------------------------- | ----------- |
| Extra page beyond included               | R1,500 each |
| Copywriting                              | R5,000      |
| Blog or news section                     | R4,000      |
| Extra language                           | R3,500 each |
| Booking or quote system                  | R8,000      |
| Online payments (non-e-commerce)         | R7,500      |
| Integration (CRM, WhatsApp, accounting…) | R5,000 each |
| AI feature                               | R20,000     |

**Timeline multipliers:** flexible ×0.95, standard ×1, within 6 weeks ×1.15, ASAP ×1.3.

## Public price placement

- **Build (Home and /start):** Business Websites from R18,000 · Custom/Immersive from R35,000 · E-commerce
  from R45,000 · Web Apps & MVPs from R75,000 · Custom Software & Mobile Apps from
  R120,000 · AI & Automation from R15,000 · Discovery from R7,500. Every estimate uses
  the R400/hour development rate.
- **Take over (/start):** audit from R2,500.
- **Plans (/pricing):** Website Care R700/month · Managed Software R3,600/month ·
  Partner tailored quote after discussing projects and monthly hours.

Home shows calculated indicative ranges for its five starting packages. The brief produces
the project-specific estimate.

## Quote builder (/start)

Steps are data in `src/data/brief.ts`, each with a `showIf` condition. Progress counts only
the visible steps. Deep links work, e.g. `/start?type=ecommerce`, `/start?kind=app` and
`/start?plan=care-essential`. There is no budget question: prices are already public.

Step 1 asks "What do you need?" and branches:

| Path                   | Steps                                                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Build something new | website, app or software → type (of that kind) → (website: pages, add-ons, languages, Website Care or "No plan for now") / (app, software: who uses it, key needs) → timeline |
| B. Something exists    | what is it → code and hosting access → situation (multi) → urgency                                                                                                            |
| C. Just a care plan    | website or app → who built it → what we look after (address, platform, hosting)                                                                                               |
| D. Partner             | what we'd work on together (short description)                                                                                                                                |
| E. Not sure            | short description                                                                                                                                                             |

All paths then go contact details → POPIA consent → review → submit.

## Estimator rules (`src/lib/estimate.ts`, pure)

Result kinds: `range` | `discovery` | `plan` | `audit` | `consult`.

- **A. Website types → range.**
  - low = (from price + extra pages + add-ons + extra languages) × timeline multiplier;
    high = low × 1.35.
  - Both are rounded to the nearest R1,000.
  - A chosen Care plan appears as a separate monthly line.
  - Shows the current Website Care monthly price after launch.
- **A. App, software and AI types, or website low ≥ R120,000 → discovery.** "Starts with
  Discovery & Scoping from R7,500", with the offering's from price as context.
- **B → audit.**
  - Website R2,500; app from R5,000. Mentions the takeover credit.
  - Urgency "today" adds hands-on care at R200/hour.
- **C → plan.**
  - Website → Website Care Essential at R700/month.
  - App → Managed Software at R3,600/month.
  - Built by someone else adds "Starts with an audit and takeover."
- **D → consult.** The description is planning input; the projects, monthly hours and price
  are agreed in conversation.
- **E → consult:** discuss what is needed and recommend a starting point and hours.
- Always shows: "Indicative estimate. Final quote after a short call."
