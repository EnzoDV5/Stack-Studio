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

Care is for websites only; Managed is for applications only.

| Plan                        | Price                              | Time    | Visibility           |
| --------------------------- | ---------------------------------- | ------- | -------------------- |
| Care Essential              | R100/month                         | 30 min  | pricing              |
| Care Business               | R400/month                         | 2 hours | pricing, highlighted |
| Care Pro                    | R600/month                         | 3 hours | pricing              |
| Managed App                 | from R800/month                    | 4 hours | pricing              |
| Managed Business System     | from R1,600/month                  | 8 hours | pricing              |
| Mission-Critical Management | from R20,000/month                 | –       | hidden               |
| Website Hosting only        | from R450/month                    | –       | hidden               |
| App Hosting only            | from R1,500/month + infrastructure | –       | hidden               |

- **Care Essential:** managed hosting, SSL, domain/DNS, backups, uptime monitoring,
  dependency updates, basic security, small fixes, basic support, up to 30 min of content
  changes.
- **Care Business:** everything in Essential, plus better monitoring, performance checks,
  analytics checks, staging where required, priority support and a monthly health check.
- **Care Pro:** everything in Business, plus advanced monitoring, more frequent backups,
  performance optimisation, backend/database checks, priority fixes and monthly reporting.
- **Managed App:** app, backend and database monitoring, deployment management, backups,
  dependency updates, security, bug fixes, support and infrastructure management.
- **Managed Business System:** everything in Managed App, plus higher-priority support,
  more monitoring, database health, server/infrastructure management, performance checks
  and a monthly technical review.
- **Mission-Critical** is quoted on users, traffic, infrastructure, risk, response time,
  database size and integrations.
- **Hosting-only plans** are rendered only as the line "Hosting-only available on
  request".
- Website Care and Managed Software are calculated from their included working hours at
  R200/hour. Third-party infrastructure and usage remain separate where applicable.

## 04 Improve

- For an existing website or app that needs updates, new pages, added features,
  integrations, UX/UI improvements, or a partial or full redesign.
- Work is estimated at R400/hour and presented as an estimated-hours quote before it starts.
- Once the changes are live, ongoing Website Care or Managed Software can be added at
  R200 per included working hour.

## 05 Partner (monthly, 3-month minimum, billed in advance)

| Plan               | Price              | Reserved hours | Visibility           |
| ------------------ | ------------------ | -------------- | -------------------- |
| Partner 10         | R4,000/month       | 10             | pricing              |
| Partner 20         | R8,000/month       | 20             | pricing, highlighted |
| Partner 40         | R16,000/month      | 40             | pricing              |
| Dedicated Capacity | from R50,000/month | –              | hidden               |

- **Partner 10:** UX/UI, frontend, backend, small integrations, improvements, technical
  support, monthly planning, priority over non-retainer work.
- **Partner 20:** adds database work, API integrations, new features, automation,
  technical planning and priority support.
- **Partner 40:** adds product development, infrastructure, monthly roadmap planning and
  priority development.
- Note shown on the Partner family: "Limited to 3 partner clients at a time."

## Policies (Pricing page and /terms)

- **Projects under R50,000:** 50% to start, 30% at the design/development milestone, 20%
  before launch.
- **Larger projects:** 30% to start, 30% at core system, 30% at feature complete, 10% at
  deployment.
- **Retainers:** billed monthly in advance, 3-month minimum. Unused hours roll over one
  month, then expire. Support during business hours (SAST).
- **Annual prepay (optional):** 12 months for the price of 11.
- **Third-party costs:** cloud (AWS, Azure, Firebase, Supabase, Cloudflare), AI/API usage,
  email, SMS and storage are billed at actual cost. The client pays the Stack plan plus
  actual usage.
- **Domains:** registration and renewal at cost; management is included in relevant plans.
- **30-day launch warranty:** every new build includes bug fixes on what Stack built. No
  new features.
- **Maintenance is not unlimited features.**
  - Included: bug fixes, updates, monitoring, the plan's hours.
  - Not included: new functionality, redesigns, major integrations, new applications,
    large content changes. These are quoted separately or taken from retainer hours.
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

**Budget ranges:** Under R20k · R20k–R40k · R40k–R75k · R75k–R150k · R150k+ · Not sure.

## Public pricing summary (Pricing page)

- **Build:** Business Websites from R18,000 · Custom/Immersive from R35,000 · E-commerce
  from R45,000 · Web Apps & MVPs from R75,000 · Custom Software & Mobile Apps from
  R120,000 · AI & Automation from R15,000 · Discovery from R7,500. Every estimate uses
  the R400/hour development rate.
- **Take over:** audit from R2,500
- **Run:** Website Care from R100/month · Managed Software from R800/month
- **Partner:** from R4,000/month
- Underneath: "Need something more specific? Every project is different. Build a quick
  project brief and we'll give you a more accurate estimate. → Build my estimate"

Home teaser: "Websites from R18,000 · Care from R100/month · Partner from R4,000/month".

## Quote builder (/start)

Steps are data in `src/data/brief.ts`, each with a `showIf` condition. Progress counts only
the visible steps. Deep links work, e.g. `/start?path=build&type=ecommerce` and
`/start?plan=care-business`.

Step 1 asks "What do you need?" and branches:

| Path                   | Steps                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Build something new | type → (website: pages, add-ons, languages, Care plan defaulting to Care Business or "No plan for now") / (app, software, AI: who uses it, key needs) → timeline → budget |
| B. Something exists    | what is it → code and hosting access → situation (multi) → urgency                                                                                                        |
| C. Keep it running     | website or app → who built it → change frequency                                                                                                                          |
| D. Ongoing development | kind of work (multi) → hours per month                                                                                                                                    |
| E. Not sure            | short description                                                                                                                                                         |

All paths then go contact details → POPIA consent → review → submit.

## Estimator rules (`src/lib/estimate.ts`, pure)

Result kinds: `range` | `discovery` | `plan` | `audit` | `consult`.

- **A. Website types → range.**
  - low = (from price + extra pages + add-ons + extra languages) × timeline multiplier;
    high = low × 1.35.
  - Both are rounded to the nearest R1,000, and budget fit is kept.
  - A chosen Care plan appears as a separate monthly line.
  - Always shows the nudge: "Most clients add Website Care from R1,250/month after launch."
- **A. App, software and AI types, or website low ≥ R120,000 → discovery.** "Starts with
  Discovery & Scoping from R7,500", with the offering's from price as context.
- **B → audit.**
  - Website R2,500; app from R5,000. Mentions the takeover credit.
  - Urgency "today" adds hands-on care at R200/hour.
- **C → plan.**
  - Website: rarely → Care Essential, monthly → Care Business, weekly → Care Pro.
  - App: rarely or monthly → Managed App, weekly → Managed Business System.
  - Built by someone else adds "Starts with an audit and takeover."
- **D → plan.**
  - A few → ad-hoc R400/hour or Partner 10.
  - About 10 → Partner 10; about 20 → Partner 20; 40+ → Partner 40 (limited spots).
- **E → consult:** "We'll suggest the right starting point after a short call."
- Always shows: "Indicative estimate. Final quote after a short call."
