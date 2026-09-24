/**
 * Copy for the Start a project guided brief (/start). Options come from data/pricing.ts;
 * this file holds the questions, labels, validation messages and success/error states.
 */
import type { BudgetFit } from '@/lib/estimate'
import type { BriefStepId } from '@/types'

export const briefCopy = {
  intro: {
    eyebrow: 'Start a project', // COPY:
    title: 'Tell us what you’re building.', // COPY:
    intro:
      'Seven quick questions, about two minutes. You’ll see a rough estimate as you go, and nothing is sent until the last step.', // COPY:
  },

  stepLabels: {
    type: 'Project', // COPY:
    scope: 'Scope', // COPY:
    features: 'Features', // COPY:
    timeline: 'Timeline', // COPY:
    budget: 'Budget', // COPY:
    contact: 'Details', // COPY:
    review: 'Review', // COPY:
  } satisfies Record<BriefStepId, string>,

  steps: {
    type: {
      title: 'What are we building?', // COPY:
      hint: 'Pick the closest fit. You can change it later.', // COPY:
    },
    scope: {
      title: 'Roughly how big is it?', // COPY:
      hint: 'Count the main pages. A guess is fine.', // COPY:
    },
    features: {
      title: 'Anything extra?', // COPY:
      hint: 'Choose any that apply, or skip this step.', // COPY:
      addOnsLabel: 'Add-ons', // COPY:
      planLabel: 'After launch', // COPY:
      planHint: 'Most clients add a monthly plan so hosting and changes are handled.', // COPY:
      noPlan: { label: 'No plan for now', description: 'You can add one any time.' }, // COPY:
    },
    timeline: {
      title: 'When do you need it?', // COPY:
      hint: 'Rush timelines are possible, but they cost a little more.', // COPY:
    },
    budget: {
      title: 'What budget are you working with?', // COPY:
      hint: 'This helps us suggest the right scope. We never quote to the top of your range.', // COPY:
    },
    contact: {
      title: 'Where should we reply?', // COPY:
      hint: 'We reply within one business day.', // COPY:
    },
    review: {
      title: 'Check and send.', // COPY:
      hint: 'Everything look right? You can edit any answer.', // COPY:
    },
  },

  nav: {
    back: 'Back', // COPY:
    next: 'Continue', // COPY:
    skip: 'Skip', // COPY:
    submit: 'Send brief', // COPY:
    submitting: 'Sending…', // COPY:
    edit: 'Edit', // COPY:
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`, // COPY:
    keyboardHint: 'Enter ↵ to continue · 1–9 to choose', // COPY:
    progressLabel: 'Brief progress', // COPY:
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
    projectType: 'Choose the option closest to your project.', // COPY:
    scope: 'Choose a rough size, or “Not sure yet”.', // COPY:
    timeline: 'Choose a timeline.', // COPY:
    budget: 'Choose a budget range.', // COPY:
    name: 'Please tell us your name.', // COPY:
    email: 'Please enter a valid email address.', // COPY:
    phone: 'That phone number doesn’t look right.', // COPY:
    message: 'Please keep this under 2 000 characters.', // COPY:
    consent: 'Please agree to the privacy notice so we can reply.', // COPY:
    summary: 'Please fix the highlighted field.', // COPY:
  },

  estimate: {
    title: 'Live estimate', // COPY:
    empty: 'Pick a project type to see an estimate.', // COPY:
    onceLabel: 'Once-off build', // COPY:
    monthlyLabel: 'Monthly', // COPY:
    perMonth: '/month', // COPY:
    timelineLabel: 'Typical build time', // COPY:
    weeks: (a: number, b: number) => `${a}–${b} weeks`, // COPY:
    breakdownLabel: 'Breakdown', // COPY:
    rushLabel: 'Timeline adjustment', // COPY:
    budgetLabel: 'Budget fit', // COPY:
    budgetFit: {
      unknown: '',
      comfortable: 'Your budget comfortably covers this.', // COPY:
      within: 'This fits your budget.', // COPY:
      tight: 'Tight but workable. We can phase the build.', // COPY:
      over: 'Above your range. We’ll suggest a phased approach or a leaner scope.', // COPY:
    } satisfies Record<BudgetFit, string>,
    disclaimer: 'Indicative only. Your fixed quote follows a short discovery call.', // COPY:
    mobileToggle: 'Estimate', // COPY:
  },

  review: {
    labels: {
      projectType: 'Project', // COPY:
      scope: 'Scope', // COPY:
      features: 'Add-ons', // COPY:
      monthlyPlan: 'Monthly plan', // COPY:
      timeline: 'Timeline', // COPY:
      budget: 'Budget', // COPY:
      contact: 'Contact', // COPY:
    },
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
      'A 20-minute discovery call to fill in the gaps.', // COPY:
      'A fixed quote and timeline, with no surprises.', // COPY:
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
