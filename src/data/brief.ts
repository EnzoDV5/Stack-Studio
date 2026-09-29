/**
 * The Start a project quote builder (/start), as configuration. Steps render in this order
 * when all their `showIf` conditions pass; progress counts only visible steps. Options with
 * a `source` are resolved from services/addons/plans (lib/brief-steps.ts). The copy for
 * every estimate result lives here too. Rules: docs/pricing-model.md.
 */
import type { BudgetFit } from '@/lib/estimate'
import type { BriefStepConfig, BudgetRange, ShowIf, TimelineOption } from '@/types'

const BUILD: ShowIf[] = [{ field: 'path', in: ['build'] }]
const WEBSITE: ShowIf[] = [...BUILD, { field: 'buildCategory', in: ['website'] }]
const SOFTWARE: ShowIf[] = [...BUILD, { field: 'buildCategory', in: ['software'] }]

export const briefSteps: BriefStepConfig[] = [
  {
    id: 'path',
    kind: 'single',
    field: 'path',
    label: 'Need', // COPY:
    title: 'What do you need?', // COPY:
    hint: 'Pick the closest fit. We’ll ask a few questions about it.', // COPY:
    options: [
      {
        value: 'build',
        label: 'Build something new',
        description: 'A website, web app, software or AI feature.',
      }, // COPY:
      {
        value: 'existing',
        label: 'Something already exists',
        description: 'Take it over, fix it or improve it.',
      }, // COPY:
      {
        value: 'run',
        label: 'Keep my site or app running',
        description: 'Hosting, care and management every month.',
      }, // COPY:
      {
        value: 'develop',
        label: 'Ongoing development',
        description: 'A team for regular features and improvements.',
      }, // COPY:
      {
        value: 'unsure',
        label: 'Not sure yet',
        description: 'Tell us what’s going on and we’ll suggest a start.',
      }, // COPY:
    ],
  },

  /* ---------- A. Build ---------- */
  {
    id: 'buildType',
    kind: 'single',
    field: 'buildType',
    source: 'buildOfferings',
    label: 'Project', // COPY:
    title: 'What are we building?', // COPY:
    hint: 'Pick the closest fit. You can change it later.', // COPY:
    showIf: BUILD,
  },
  {
    id: 'pages',
    kind: 'count',
    field: 'pages',
    min: 1,
    max: 40,
    unit: { one: 'page', other: 'pages' }, // COPY:
    label: 'Pages', // COPY:
    title: 'Roughly how many pages?', // COPY:
    hint: 'Count the main pages. A guess is fine.', // COPY:
    showIf: WEBSITE,
  },
  {
    id: 'addOns',
    kind: 'multi',
    field: 'addOns',
    source: 'websiteAddOns',
    min: 0,
    label: 'Add-ons', // COPY:
    title: 'Anything extra?', // COPY:
    hint: 'Choose any that apply, or skip this step.', // COPY:
    showIf: WEBSITE,
  },
  {
    id: 'languages',
    kind: 'count',
    field: 'languages',
    min: 1,
    max: 6,
    unit: { one: 'language', other: 'languages' }, // COPY:
    label: 'Languages', // COPY:
    title: 'How many languages?', // COPY:
    hint: 'Including English. One is the default.', // COPY:
    showIf: WEBSITE,
  },
  {
    id: 'carePlan',
    kind: 'single',
    field: 'carePlan',
    source: 'carePlans',
    extraOption: {
      value: 'none',
      label: 'No plan for now',
      description: 'You can add one any time.',
    }, // COPY:
    label: 'After launch', // COPY:
    title: 'Who looks after it after launch?', // COPY:
    hint: 'Website Care covers hosting, security, updates and monthly changes.', // COPY:
    showIf: WEBSITE,
  },
  {
    id: 'audience',
    kind: 'single',
    field: 'audience',
    label: 'Users', // COPY:
    title: 'Who will use it?', // COPY:
    hint: 'This shapes accounts, roles and the admin side.', // COPY:
    options: [
      { value: 'customers', label: 'Customers', description: 'People outside your business.' }, // COPY:
      { value: 'staff', label: 'Staff', description: 'Your team, internally.' }, // COPY:
      { value: 'both', label: 'Both', description: 'Customers and staff, with different access.' }, // COPY:
    ],
    showIf: SOFTWARE,
  },
  {
    id: 'needs',
    kind: 'multi',
    field: 'needs',
    min: 0,
    label: 'Key needs', // COPY:
    title: 'What does it need to do?', // COPY:
    hint: 'Choose any that apply.', // COPY:
    options: [
      { value: 'accounts', label: 'User accounts' }, // COPY:
      { value: 'payments', label: 'Payments' }, // COPY:
      { value: 'dashboards', label: 'Dashboards and reporting' }, // COPY:
      { value: 'integrations', label: 'Integrations' }, // COPY:
      { value: 'ai', label: 'AI features' }, // COPY:
      { value: 'mobile', label: 'Mobile app' }, // COPY:
      { value: 'admin', label: 'Admin system' }, // COPY:
    ],
    showIf: SOFTWARE,
  },
  {
    id: 'timeline',
    kind: 'single',
    field: 'timeline',
    source: 'timelines',
    label: 'Timeline', // COPY:
    title: 'When do you need it?', // COPY:
    hint: 'Rush timelines are possible, but they cost a little more.', // COPY:
    showIf: BUILD,
  },
  {
    id: 'budget',
    kind: 'single',
    field: 'budget',
    source: 'budgets',
    label: 'Budget', // COPY:
    title: 'What budget are you working with?', // COPY:
    hint: 'This helps us suggest the right scope. We won’t simply aim for the top of your range.', // COPY:
    showIf: BUILD,
  },

  /* ---------- B. Something exists ---------- */
  {
    id: 'existingType',
    kind: 'single',
    field: 'existingType',
    label: 'What it is', // COPY:
    title: 'What do you have?', // COPY:
    hint: 'The thing you need help with.', // COPY:
    options: [
      { value: 'website', label: 'A website' }, // COPY:
      { value: 'web-app', label: 'A web app' }, // COPY:
      { value: 'mobile-app', label: 'A mobile app' }, // COPY:
      { value: 'other', label: 'Something else' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['existing'] }],
  },
  {
    id: 'access',
    kind: 'single',
    field: 'access',
    label: 'Access', // COPY:
    title: 'Do you have the code and hosting access?', // COPY:
    hint: 'Logins for hosting, the domain and the code repository. No problem if not.', // COPY:
    options: [
      { value: 'yes', label: 'Yes' }, // COPY:
      { value: 'partly', label: 'Partly' }, // COPY:
      { value: 'no', label: 'No' }, // COPY:
      { value: 'unsure', label: 'Not sure' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['existing'] }],
  },
  {
    id: 'situation',
    kind: 'multi',
    field: 'situation',
    min: 1,
    label: 'Situation', // COPY:
    title: 'What’s going on?', // COPY:
    hint: 'Choose all that apply.', // COPY:
    options: [
      { value: 'broken', label: 'Something is broken' }, // COPY:
      { value: 'slow', label: 'It’s slow' }, // COPY:
      { value: 'outdated', label: 'It’s outdated' }, // COPY:
      { value: 'developer-gone', label: 'Our developer is gone' }, // COPY:
      { value: 'features', label: 'We need new features' }, // COPY:
      { value: 'managed', label: 'We want it managed' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['existing'] }],
  },
  {
    id: 'urgency',
    kind: 'single',
    field: 'urgency',
    label: 'Urgency', // COPY:
    title: 'How urgent is it?', // COPY:
    hint: 'If it’s down right now, we’ll treat it as an emergency.', // COPY:
    options: [
      { value: 'month', label: 'This month' }, // COPY:
      { value: 'soon', label: 'Soon, no rush' }, // COPY:
      { value: 'today', label: 'Today: it’s down' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['existing'] }],
  },

  /* ---------- C. Keep it running ---------- */
  {
    id: 'runType',
    kind: 'single',
    field: 'runType',
    label: 'Type', // COPY:
    title: 'Is it a website or an app?', // COPY:
    hint: 'Care plans are for websites, Managed plans for applications.', // COPY:
    options: [
      { value: 'website', label: 'A website' }, // COPY:
      { value: 'app', label: 'An app or software system' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['run'] }],
  },
  {
    id: 'builtBy',
    kind: 'single',
    field: 'builtBy',
    label: 'Built by', // COPY:
    title: 'Who built it?', // COPY:
    hint: 'If it wasn’t us, we start with a quick audit.', // COPY:
    options: [
      { value: 'stack', label: 'Stack Studio' }, // COPY:
      { value: 'other', label: 'Someone else' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['run'] }],
  },
  {
    id: 'changeFrequency',
    kind: 'single',
    field: 'changeFrequency',
    label: 'Changes', // COPY:
    title: 'How often do you need changes?', // COPY:
    hint: 'Content edits, small fixes and tweaks.', // COPY:
    options: [
      { value: 'rarely', label: 'Rarely' }, // COPY:
      { value: 'monthly', label: 'Every month' }, // COPY:
      { value: 'weekly', label: 'Every week' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['run'] }],
  },

  /* ---------- D. Ongoing development ---------- */
  {
    id: 'workKinds',
    kind: 'multi',
    field: 'workKinds',
    min: 1,
    label: 'Work', // COPY:
    title: 'What kind of work?', // COPY:
    hint: 'Choose all that apply.', // COPY:
    options: [
      { value: 'ux', label: 'UX/UI' }, // COPY:
      { value: 'frontend', label: 'Frontend' }, // COPY:
      { value: 'backend', label: 'Backend' }, // COPY:
      { value: 'integrations', label: 'Integrations' }, // COPY:
      { value: 'ai', label: 'AI' }, // COPY:
      { value: 'infrastructure', label: 'Infrastructure' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['develop'] }],
  },
  {
    id: 'hours',
    kind: 'single',
    field: 'hours',
    label: 'Hours', // COPY:
    title: 'Roughly how many hours a month?', // COPY:
    hint: 'A guess is fine. You can change it month to month.', // COPY:
    options: [
      { value: 'few', label: 'A few' }, // COPY:
      { value: '10', label: 'About 10' }, // COPY:
      { value: '20', label: 'About 20' }, // COPY:
      { value: '40', label: '40 or more' }, // COPY:
    ],
    showIf: [{ field: 'path', in: ['develop'] }],
  },

  /* ---------- E. Not sure ---------- */
  {
    id: 'description',
    kind: 'text',
    field: 'description',
    minLength: 10,
    placeholder: 'e.g. Our booking process is all on WhatsApp and it’s getting messy…', // COPY:
    label: 'Description', // COPY:
    title: 'Tell us what’s going on.', // COPY:
    hint: 'A few sentences is plenty.', // COPY:
    showIf: [{ field: 'path', in: ['unsure'] }],
  },

  /* ---------- All paths ---------- */
  {
    id: 'contact',
    kind: 'contact',
    label: 'Details', // COPY:
    title: 'Where should we reply?', // COPY:
    hint: 'We reply within one business day.', // COPY:
  },
  {
    id: 'review',
    kind: 'review',
    label: 'Review', // COPY:
    title: 'Check and send.', // COPY:
    hint: 'Everything look right? You can edit any answer.', // COPY:
  },
]

export const timelineOptions: TimelineOption[] = [
  {
    id: 'flexible',
    label: 'Flexible',
    description: 'No rush, 3+ months is fine',
    multiplier: 0.95,
  }, // COPY:
  {
    id: 'standard',
    label: 'In the next 2–3 months',
    description: 'A normal project pace',
    multiplier: 1,
  }, // COPY:
  {
    id: 'soon',
    label: 'Within 6 weeks',
    description: 'We’ll prioritise your project',
    multiplier: 1.15,
  }, // COPY:
  {
    id: 'urgent',
    label: 'ASAP',
    description: 'Rush delivery with a dedicated schedule',
    multiplier: 1.3,
  }, // COPY:
]

export const budgetRanges: BudgetRange[] = [
  { id: 'under-20', label: 'Under R20k', min: 0, max: 20_000 }, // COPY:
  { id: '20-40', label: 'R20k – R40k', min: 20_000, max: 40_000 }, // COPY:
  { id: '40-75', label: 'R40k – R75k', min: 40_000, max: 75_000 }, // COPY:
  { id: '75-150', label: 'R75k – R150k', min: 75_000, max: 150_000 }, // COPY:
  { id: '150-plus', label: 'R150k+', min: 150_000, max: null }, // COPY:
  { id: 'unsure', label: 'Not sure', min: null, max: null }, // COPY:
]

/** Defaults for a fresh brief (the Care plan preselects Care Business). */
export const briefDefaults = {
  pages: 5,
  languages: 1,
  carePlan: 'care-business',
}

export const briefCopy = {
  intro: {
    eyebrow: 'Start a project', // COPY:
    title: 'Tell us what you need.', // COPY:
    intro:
      'A few quick questions, about two minutes. You’ll see an estimate or a recommended plan as you go, and nothing is sent until the last step.', // COPY:
  },

  nav: {
    back: 'Back', // COPY:
    next: 'Continue', // COPY:
    submit: 'Send brief', // COPY:
    submitting: 'Sending…', // COPY:
    edit: 'Edit', // COPY:
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`, // COPY:
    keyboardHint: 'Enter ↵ to continue · 1–9 to choose', // COPY:
    progressLabel: 'Brief progress', // COPY:
    decrease: 'Fewer', // COPY:
    increase: 'More', // COPY:
    includedPages: (n: number) => `${n} included in the price.`, // COPY:
  },

  fields: {
    name: { label: 'Your name', placeholder: 'Jane Dlamini', autoComplete: 'name' }, // COPY:
    email: { label: 'Email', placeholder: 'jane@company.co.za', autoComplete: 'email' }, // COPY:
    phone: { label: 'Phone (optional)', placeholder: '+27 82 000 0000', autoComplete: 'tel' }, // COPY:
    company: {
      label: 'Company or organisation (optional)',
      placeholder: 'Company name',
      autoComplete: 'organization',
    }, // COPY:
    message: {
      label: 'Anything else we should know? (optional)',
      placeholder: 'Links, goals, competitors you like…',
      autoComplete: 'off',
    }, // COPY:
  },

  consent: {
    label:
      'I agree that Stack Studio may use these details to respond to my enquiry, as described in the', // COPY:
    linkLabel: 'privacy notice', // COPY:
    note: 'POPIA: we only use your information to reply to this enquiry and prepare a quote. We never sell or share it for marketing, and you can ask us to delete it at any time.', // COPY:
  },

  errors: {
    choose: 'Please choose an option.', // COPY:
    chooseMany: 'Please choose at least one.', // COPY:
    count: 'Please pick a number in range.', // COPY:
    description: 'Please tell us a little more (at least a sentence).', // COPY:
    name: 'Please tell us your name.', // COPY:
    email: 'Please enter a valid email address.', // COPY:
    phone: 'That phone number doesn’t look right.', // COPY:
    message: 'Please keep this under 2 000 characters.', // COPY:
    consent: 'Please agree to the privacy notice so we can reply.', // COPY:
    summary: 'Please fix the highlighted field.', // COPY:
  },

  estimate: {
    title: 'Live estimate', // COPY:
    empty: 'Answer a few questions to see an estimate.', // COPY:
    perMonth: '/month', // COPY:
    perHour: '/hour', // COPY:
    disclaimer: 'Indicative estimate. Final quote after a short call.', // COPY:
    breakdownLabel: 'Breakdown', // COPY:
    timelineAdjust: 'Timeline adjustment', // COPY:
    range: {
      label: 'Estimated build', // COPY:
      monthlyLabel: 'After launch', // COPY:
      careNudge: (price: string) =>
        `Most clients add Website Care from ${price}/month after launch.`, // COPY:
      budgetLabel: 'Budget fit', // COPY:
      extraPages: (n: number) => `${n} extra page${n === 1 ? '' : 's'}`, // COPY:
      extraLanguages: (n: number) => `${n} extra language${n === 1 ? '' : 's'}`, // COPY:
    },
    discovery: {
      label: 'Where it starts', // COPY:
      required: (price: string) => `Starts with Discovery & Scoping from ${price}`, // COPY:
      optional: (price: string) =>
        `We confirm scope on a short call. Complex builds start with Discovery & Scoping from ${price}.`, // COPY:
      context: (name: string, price: string) => `${name} from ${price}`, // COPY:
      why: 'Discovery turns requirements into a buildable plan and a full development estimate.', // COPY:
    },
    audit: {
      label: 'Where it starts', // COPY:
      title: (name: string, price: string, isFrom: boolean) =>
        `${name} ${isFrom ? 'from ' : ''}${price}`, // COPY:
      credit: 'The audit fee is credited against a takeover signed within 30 days.', // COPY:
      next: (name: string, price: string) => `Then: ${name} from ${price}`, // COPY:
      emergency: (price: string) => `Down right now? Same-day emergency work is ${price}/hour.`, // COPY:
    },
    plan: {
      label: 'Recommended plan', // COPY:
      alternative: 'Or', // COPY:
      hourly: (name: string, price: string) => `${name}: ${price}/hour`, // COPY:
      needsAudit: 'Starts with an audit and takeover.', // COPY:
      minTerm: (n: number) => `${n}-month minimum, billed monthly in advance.`, // COPY:
      hours: (label: string) => `${label} included each month`, // COPY:
    },
    consult: {
      label: 'Next step', // COPY:
      body: 'We’ll suggest the right starting point after a short call.', // COPY:
    },
    budgetFit: {
      unknown: '',
      comfortable: 'Your budget comfortably covers this.', // COPY:
      within: 'This fits your budget.', // COPY:
      tight: 'Tight but workable. We can phase the build.', // COPY:
      over: 'Above your range. We’ll suggest a phased approach or a leaner scope.', // COPY:
    } satisfies Record<BudgetFit, string>,
    mobileToggle: 'Estimate', // COPY:
  },

  review: {
    none: 'None', // COPY:
  },

  aside: {
    title: 'Prefer to talk?', // COPY:
    body: 'Skip the form and message us on WhatsApp, or email us directly.', // COPY:
    whatsappLabel: 'WhatsApp us', // COPY:
    whatsappMessage: 'Hi Stack Studio, I’d like to chat about a project.', // COPY:
  },

  prefill: {
    notice: (name: string) => `We’ve pre-selected ${name}.`, // COPY:
    change: 'Change', // COPY:
  },

  success: {
    eyebrow: 'Brief received', // COPY:
    title: (name: string) => `Thanks${name ? `, ${name.split(' ')[0]}` : ''}. We’re on it.`, // COPY:
    body: 'Your brief is with us. Here’s what happens next:', // COPY:
    steps: [
      'We read your brief and reply within one business day.', // COPY:
      'A short call to fill in the gaps.', // COPY:
      'A written quote or a recommended plan for you to look over.', // COPY:
    ],
    urgent: 'Something urgent? Message us on WhatsApp.', // COPY:
    home: { label: 'Back to home', to: '/' }, // COPY:
    work: { label: 'Browse our work', to: '/work' }, // COPY:
  },

  failure: {
    title: 'That didn’t send.', // COPY:
    body: 'Something went wrong on our side. Your answers are saved. Try again, or reach us on WhatsApp or email.', // COPY:
    retry: 'Try again', // COPY:
  },
}
