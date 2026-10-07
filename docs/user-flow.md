# User flow

The site's job is to remove four moments of doubt, in order, and then make the first step
easy. Every page has one main action: **Start a project**.

```
FIND ─────────► TRUST ─────────► UNDERSTAND ─────────► CONTACT
"Who are you?"   "Can you do it?"  "What do I get,       "How do I start?"
                                    what does it cost?"
Home hero        Featured work      /services (what,      Guided brief (/start)
"What do you     Case studies       how it runs)          WhatsApp (fallback)
 need?"          Metrics, quotes    /pricing (every       Email (footer)
Studio snippet                      care and Partner)
```

## Primary path (the flow the home page is built around)

1. **Land on Home.** A short preloader (once per session) opens onto a big statement over
   the showreel ("Build it. Run it. Grow it.") with the Stack mark filling the right side,
   and the CTA is visible within 1 second. _Doubt removed: Find._
2. **Choose a path.** "What do you need?" lets visitors choose in their own words:
   something new, fixing or improving what they have, ongoing care, or a software team.
   Each leads to details on /services or straight into the matching brief; ongoing care
   opens the monthly plans on /pricing instead. The stack behind the work runs along its
   bottom. _Doubt
   removed: Understand (what)._
3. **Pick a starting point.** The website packages open as disclosure rows beside a laptop
   showing sites we built (or bookings on the phone). Each row shows an indicative price range;
   visitors open the build brief for a project estimate. _Doubt removed: "what would mine
   look like, and where do I start?"_
4. **The work.** Every project, large, sliding past in the pinned reel, then what those
   clients say about it. _Doubt removed: Trust._
5. **The founders.** Real people who are accountable.
6. **Giant closing CTA** leads to `/start`. _Doubt removed: Contact._

Home shows indicative package ranges and routes project estimates to /start. Every Home section ends with a "go deeper"
link, so visitors choose where to go next.

## Who answers what

- **Home:** who are you, and can you do it? (stages and the stack, packages, work, clients,
  founders)
- **Services:** what do you do, and how does a project run? No prices. Picking a service
  opens the brief ready for it (`/start?type=<service>` or the group's `?path=`).
- **Plans:** how does ongoing care work, and what support fits? A video and three clear steps
  explain how care runs, then detailed cards compare Website Care, Managed Software and Partner. The orange
  Partner card opens a brief to discuss projects and monthly hours.
- **Start:** the real estimate for this project, then contact.

The three levels of price are always in this order: **package** (ballpark, on Home) →
**brief estimate** (for this project, on /start) → **fixed quote** (after a short call).

## Deeper paths

- **Sceptic path:** Home, then a featured case study, then `/work/:slug` (problem → approach
  → build → result, metrics), then **Start a project like this** (brief pre-filled), or Next
  project.
- **Ongoing support path:** Header link to `/pricing`, compare care plans or discuss a
  Partner engagement, then confirm the scope together.
- **Services path:** `/services`, open a service, **Start with this** (`/start?type=`),
  or read how a project runs and follow **See what it costs** to `/pricing`.
- **Referral path:** Arrives on `/work/gc-solar` from a shared link, gets the context
  straight away, sees the next project, then the footer CTA.
- **Mobile, WhatsApp-first path:** Mobile menu, then the WhatsApp button (footer or `/start`).

## Start a project (guided brief)

```
[1 Type] → [2 Scope] → [3 Features + ongoing plan] → [4 Timeline] → [5 Budget]
        → [6 Contact + POPIA consent] → [7 Review] → submit → [Success]
```

- One question per screen, a progress bar, Back and Next, and keyboard support: Enter moves
  on, number keys pick an option, and arrow keys move within a group.
- Deep links pre-fill it: `?path=`, `?type=<offering>`, `?plan=<plan>` and
  `?quote=<starting quote>` (from a saved package link).
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
3. **Budget fit, not budget judgement.** The budget step compares the chosen range with
   the estimate and suggests phasing or a monthly plan when it is tight, instead of turning
   people away.
4. **WhatsApp as a pressure valve.** Many South African clients prefer it, so it sits next
   to the brief as an equal alternative instead of being buried in the footer.
5. **Case study CTA before Next project.** People who finish a case study have the most
   trust. The CTA comes first and "Next project" second, so the loop doesn't swallow them.
6. **"What happens next" on success.** This removes the last doubt: "did it work, and now
   what?"
