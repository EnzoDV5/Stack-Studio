# User flow

The site's job is to remove four moments of doubt, in order, and then make the first step
easy. Every page has one main action: **Start a project**.

```
FIND ─────────► TRUST ─────────► UNDERSTAND ─────────► CONTACT
"Who are you?"   "Can you do it?"  "What do I get,       "How do I start?"
                                    what does it cost?"
Home hero        Featured work      Services rows         Guided brief (/start)
Technology strip Case studies       Pricing teaser        WhatsApp (fallback)
Studio snippet   Metrics, quotes    /services, /pricing   Email (footer)
```

## Primary path (the flow the home page is built around)

1. **Land on Home.** A short preloader (once per session) opens onto a big statement over
   the showreel. The CTA is visible within 1 second. _Doubt removed: Find._
2. **Scroll.** A technology capability strip, then two featured case studies with large media.
   Hovering previews the work in motion. _Doubt removed: Trust._
3. **Keep scrolling.** Services as expanding rows, then a pinned process section showing
   exactly how a project runs. _Doubt removed: Understand (what)._
4. **Pricing teaser.** "From" prices for project builds, plus the monthly plan hook.
   _Doubt removed: Understand (cost)._
5. **The founders and a testimonial.** Real people who are accountable.
6. **Giant closing CTA** leads to `/start`. _Doubt removed: Contact._

## Deeper paths

- **Sceptic path:** Home, then a featured case study, then `/work/:slug` (problem → approach
  → build → result, metrics), then **Start a project like this** (brief pre-filled), or Next
  project.
- **Price-shopper path:** Header link to `/pricing`, compare build and monthly plans, then
  "Get an estimate", which opens `/start` with the live estimate.
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
