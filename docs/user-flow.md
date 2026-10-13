# User flow

The site's job is to remove four moments of doubt, in order, and then make the first step
easy. Every page has one main action: **Start a project**.

```
FIND ─────────► UNDERSTAND ─────────► TRUST ─────────► CONTACT
"Who are you?"   "What do you do?"    "Can you do it?"  "How do I start?"
Home hero        Needs and services  Featured work      Guided brief (/start)
"What do you     Process summary     Case studies       WhatsApp (fallback)
 need?"          /services, /process Client voices      Email (footer)
Studio snippet
```

## Primary path (the flow the home page is built around)

1. **Land on Home.** A short preloader (once per session) opens onto a big statement over
   the showreel ("Build it. Run it. Grow it.") with the Stack mark filling the right side,
   and the CTA is visible within 1 second. _Doubt removed: Find._
2. **Choose a path.** "What do you need?" lets visitors choose in their own words:
   something new, fixing or improving what they have (quoted by the hour), a new home and
   ongoing care (a care plan), or a software team. Each leads to details on /services or
   straight into the matching brief; the care path opens the monthly plans on /services#plans instead. The stack behind the work runs along its
   bottom. _Doubt
   removed: Understand (what)._
3. **Understand the offer.** Four concise service rows explain the work behind those needs
   and link to the right part of /services. _Doubt removed: Understand (what)._
4. **See how it works.** A vertical four-step journey shows the brief, fixed quote, build and
   ongoing care, then links to /process for the details. _Doubt removed: Understand (how)._
5. **The work.** Every project slides past in the pinned reel, followed by what its clients
   say about it. _Doubt removed: Trust._
6. **The founders.** Real people who are accountable.
7. **Giant closing CTA** leads to `/start`. _Doubt removed: Contact._

Home is a summary: no prices and no detail. Every Home section ends with a "go deeper" link to
the page that does the talking, so visitors choose where to go next.

## Who answers what

- **Home:** who are you, what do you do, how does it run and can you do it? A summary of the
  whole site (needs, services, process, work, clients, founders), each linking to its page.
- **Services:** what do you offer, and what support fits? No project prices. Picking a service
  opens the brief ready for it (`/start?type=<service>` or the group's `?path=`). Hosting and
  care is the plan cards (Website Care, Managed Software and Partner, with their prices); a
  plan's **Choose** opens the care-plan brief (no new build), and the orange Partner card opens
  a short Partner enquiry. The websites, apps and software groups open the brief at that kind
  (`/start?kind=website|app|software`).
- **Process:** how does working with you run? What happens once you get in touch, the build
  week by week, how payments work, then how care runs after launch.
- **Start:** the real estimate for this project, then contact.

Prices come in this order: the **plan prices** (on /services#plans) and the **brief estimate**
(for this project, on /start) → **fixed quote** (after a short call). Home shows none.

## Deeper paths

- **Sceptic path:** Home, then a featured case study, then `/work/:slug` (problem → approach
  → build → result, metrics), then **Start a project like this** (brief pre-filled), or Next
  project.
- **Ongoing support path:** Services, Hosting and care (`/services#plans`), compare care plans or
  discuss a Partner engagement, then confirm the scope together. **How care works** leads to
  the care steps on `/process#care`.
- **Services path:** `/services`, open a service, **Start with this** (`/start?type=`),
  or compare the plans at the end of the page.
- **Process path:** Header link to `/process`: the next steps (**Start the brief**), the
  week-by-week plan, payment terms, then how care runs (**Compare the plans** →
  `/services#plans`).
- **Referral path:** Arrives on `/work/gc-solar` from a shared link, gets the context
  straight away, sees the next project, then the footer CTA.
- **Mobile, WhatsApp-first path:** Mobile menu, then the WhatsApp button (footer or `/start`).

## Start a project (guided brief)

```
[What do you need?]
  ├ Something new  → [Website, app or software?] → [Which one] → [Scope / features + care plan]
  │                  → [Timeline]
  ├ Help with what I have → [What it is] → [Access] → [Situation] → [Urgency]
  ├ Just a care plan → [Website or app] → [Who built it] → [What do we look after?]
  ├ Partner        → [What would we work on together?]
  └ Not sure       → [Tell us what's going on]
→ [Contact + POPIA consent] → [Review] → submit → [Success]
```

There is no budget question: visitors have already seen the plan prices and the live estimate.

- One question per screen, a progress bar, Back and Next, and keyboard support: Enter moves
  on, number keys pick an option, and arrow keys move within a group.
- Deep links pre-fill it: `?path=`, `?kind=<website|app|software>`, `?type=<offering>`
  (also sets its kind), `?plan=<plan>` (the care-plan path with that plan), `?partner=` (the
  Partner enquiry) and `?quote=<starting quote>` (from a saved package link).
- The live estimate panel updates with every answer and is always labelled indicative.
- Validation runs per step with zod. Errors are announced and focus moves to them.
- The contact step requires POPIA consent and links to `/privacy`.
- Success shows what happens next (reply within one business day, discovery call, proposal)
  and offers WhatsApp for anything urgent.
- Analytics: a `Start project click` event with its location on every CTA, and
  `Brief step complete` (step id) plus `Brief submitted` so drop-off can be measured.

## Improvements on the original flow

1. **Pre-filled briefs.** Every "Start a project" link can carry context (`?type=` or
   `?service=`), so arriving from a case study or service row skips the first question. That
   is one less decision for someone who has already shown intent.
2. **Estimate before contact.** The estimate appears before we ask for contact details,
   so people see the value before they give anything away. This mirrors the Sparked
   calculator.
3. **No budget question.** Prices are public (plan cards, the live estimate), so asking for
   a budget range only added a step. Phasing or a leaner scope comes up on the call instead.
4. **WhatsApp as a pressure valve.** Many South African clients prefer it, so it sits next
   to the brief as an equal alternative instead of being buried in the footer.
5. **Case study CTA before Next project.** People who finish a case study have the most
   trust. The CTA comes first and "Next project" second, so the loop doesn't swallow them.
6. **"What happens next" on success.** This removes the last doubt: "did it work, and now
   what?"
