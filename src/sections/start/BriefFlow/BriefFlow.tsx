import {
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { Button } from '@/components/ui/Button'
import type { briefCopy as BriefCopy } from '@/data/brief'
import type { PricingData } from '@/data/pricing'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { trackEvent } from '@/lib/analytics'
import { saveDraft, clearDraft } from '@/lib/brief-draft'
import { briefReducer, initBriefState } from '@/lib/brief-reducer'
import { validateBrief, validateStep } from '@/lib/brief-schema'
import { cn } from '@/lib/cn'
import { estimate as computeEstimate } from '@/lib/estimate'
import { formatPrice, formatPriceRange } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { scrollToElement } from '@/lib/lenis'
import { distance, duration, ease } from '@/lib/motion-tokens'
import { submitBrief } from '@/lib/submit-brief'
import { BriefAside } from '@/sections/start/BriefAside'
import { BriefField } from '@/sections/start/BriefField'
import { BriefProgress } from '@/sections/start/BriefProgress'
import { BriefReview } from '@/sections/start/BriefReview'
import { BriefSuccess } from '@/sections/start/BriefSuccess'
import { ConsentField } from '@/sections/start/ConsentField'
import { EstimatePanel } from '@/sections/start/EstimatePanel'
import { OptionCard } from '@/sections/start/OptionCard'
import { BRIEF_STEPS, type BriefAnswers, type BriefContact, type BriefStepId } from '@/types'

export interface BriefFlowProps {
  copy: typeof BriefCopy
  pricing: PricingData
  initialAnswers: BriefAnswers
  initialStep?: number
  /** Name of a pre-selected package (from ?type=), shown as a notice. */
  prefillName?: string
  privacyHref: string
  whatsapp: { href: string; label: string }
  email: string
}

type SingleField = 'projectType' | 'scope' | 'timeline' | 'budget'

const TEXT_INPUT = 'input[type="text"], input[type="email"], input[type="tel"], textarea'

/**
 * The guided brief: one question per screen, progress, Back/Next, keyboard support
 * (Enter continues, 1–9 picks an option), zod validation per step, a live estimate from
 * lib/estimate.ts, and a submit with a real success state.
 */
export function BriefFlow({
  copy,
  pricing,
  initialAnswers,
  initialStep = 0,
  prefillName,
  privacyHref,
  whatsapp,
  email,
}: BriefFlowProps) {
  const [state, dispatch] = useReducer(briefReducer, undefined, () =>
    initBriefState(initialAnswers, initialStep),
  )
  const { answers, errors, stepIndex, status } = state
  const step: BriefStepId = BRIEF_STEPS[stepIndex] ?? 'type'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const formId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const shownStep = useRef(stepIndex)

  const estimate = useMemo(
    () =>
      computeEstimate(
        {
          packageId: answers.projectType,
          scopeId: answers.scope,
          addOnIds: answers.features,
          monthlyPlanId: answers.monthlyPlan,
          timelineId: answers.timeline,
          budgetId: answers.budget,
        },
        pricing,
      ),
    [answers, pricing],
  )

  // Persist the draft (this tab only) so accidental navigation doesn't lose answers.
  useEffect(() => {
    if (status !== 'success') saveDraft(answers)
  }, [answers, status])

  // On step change: move focus to the question and keep it in view.
  useEffect(() => {
    if (shownStep.current === stepIndex) return
    shownStep.current = stepIndex
    headingRef.current?.focus({ preventScroll: true })
    const top = rootRef.current?.getBoundingClientRect().top ?? 0
    if (rootRef.current && top < 0) scrollToElement(rootRef.current, -100)
  }, [stepIndex])

  // One motion idea: each step slides in from the direction of travel.
  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('[data-step-panel]', {
        x: state.direction * distance.rise,
        // opacity, not autoAlpha: visibility:hidden would block focusing the new question.
        opacity: 0,
        duration: duration.fast,
        ease: ease.out,
      })
    },
    { scope: rootRef, dependencies: [stepIndex] },
  )

  /* ---------- Option lists for single-select steps ---------- */
  const options: Record<
    SingleField,
    { value: string; label: string; description?: string; meta?: string }[]
  > = {
    projectType: pricing.packages.map((p) => ({
      value: p.id,
      label: p.name,
      description: p.tagline,
      meta: `${copy.estimate.onceLabel} · ${formatPrice(p.fromPrice)}+`,
    })),
    scope: pricing.scopeOptions.map((s) => ({
      value: s.id,
      label: s.label,
      description: s.description,
    })),
    timeline: pricing.timelineOptions.map((t) => ({
      value: t.id,
      label: t.label,
      description: t.description,
    })),
    budget: pricing.budgetRanges.map((b) => ({ value: b.id, label: b.label })),
  }
  const briefAddOns = pricing.addOns.filter((a) => a.inBrief)
  const singleFieldFor: Partial<Record<BriefStepId, SingleField>> = {
    type: 'projectType',
    scope: 'scope',
    timeline: 'timeline',
    budget: 'budget',
  }

  /* ---------- Navigation ---------- */
  const focusFirstError = (keys: string[]) => {
    const first = keys[0]
    if (!first) return
    const id = first.startsWith('contact.') ? `${formId}-${first.slice(8)}` : `${formId}-${first}`
    const el =
      document.getElementById(id) ??
      rootRef.current?.querySelector<HTMLElement>(`[aria-invalid="true"]`) ??
      null
    el?.focus()
  }

  const goNext = () => {
    const stepErrors = validateStep(step, answers)
    const keys = Object.keys(stepErrors)
    if (keys.length) {
      dispatch({ type: 'errors', errors: stepErrors })
      requestAnimationFrame(() => focusFirstError(keys))
      return
    }
    trackEvent('Brief step complete', { step, index: stepIndex + 1 })
    dispatch({ type: 'next' })
  }

  const submit = async () => {
    // Bots fill hidden fields; humans don't. Pretend success, send nothing.
    if (honeypotRef.current?.value) {
      dispatch({ type: 'success' })
      return
    }
    const result = validateBrief(answers)
    if (!result.ok) {
      const keys = Object.keys(result.errors)
      const firstStep = BRIEF_STEPS.findIndex((s) =>
        keys.some((k) => Object.keys(validateStep(s, answers)).includes(k)),
      )
      if (firstStep >= 0) dispatch({ type: 'goTo', stepIndex: firstStep })
      dispatch({ type: 'errors', errors: result.errors })
      return
    }

    dispatch({ type: 'submit' })
    try {
      await submitBrief({
        brief: result.data,
        summary: Object.fromEntries(reviewRows.map((r) => [r.label, r.value])),
        estimate: {
          onceLow: Math.round(estimate.onceLow),
          onceHigh: Math.round(estimate.onceHigh),
          monthlyTotal: estimate.monthlyTotal,
          weeks: estimate.weeks,
          budgetFit: estimate.budgetFit,
        },
        meta: {
          submittedAt: new Date().toISOString(),
          page: window.location.href,
          userAgent: navigator.userAgent,
        },
      })
      trackEvent('Brief submitted', {
        type: answers.projectType ?? 'unknown',
        budget: answers.budget ?? 'unknown',
      })
      clearDraft()
      dispatch({ type: 'success' })
    } catch (error) {
      console.error(error)
      trackEvent('Brief submit error')
      dispatch({ type: 'failure' })
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (status === 'submitting') return
    if (step === 'review') void submit()
    else goNext()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement
    const inText = target.matches(TEXT_INPUT)

    // Enter continues from option cards (text inputs already submit natively).
    if (event.key === 'Enter' && !inText && target.tagName === 'INPUT') {
      event.preventDefault()
      onSubmit(event)
      return
    }

    // 1–9 picks an option on choice steps.
    if (inText || event.metaKey || event.ctrlKey || event.altKey || !/^[1-9]$/.test(event.key))
      return
    const n = Number(event.key) - 1
    const field = singleFieldFor[step]
    if (field) {
      const option = options[field][n]
      if (option) {
        event.preventDefault()
        dispatch({ type: 'select', field, value: option.value })
      }
    } else if (step === 'features') {
      const addOn = briefAddOns[n]
      if (addOn) {
        event.preventDefault()
        dispatch({ type: 'toggleFeature', id: addOn.id })
      }
    }
  }

  /* ---------- Review rows ---------- */
  const labelOf = <T extends { id: string }>(list: T[], id: string | null, key: keyof T) =>
    (list.find((x) => x.id === id)?.[key] as string | undefined) ?? copy.review.none
  const rl = copy.review.labels
  const reviewRows = [
    {
      label: rl.projectType,
      value: labelOf(pricing.packages, answers.projectType, 'name'),
      stepIndex: 0,
    },
    { label: rl.scope, value: labelOf(pricing.scopeOptions, answers.scope, 'label'), stepIndex: 1 },
    {
      label: rl.features,
      value:
        answers.features
          .map((id) => pricing.addOns.find((a) => a.id === id)?.name)
          .filter(Boolean)
          .join(', ') || copy.review.none,
      stepIndex: 2,
    },
    {
      label: rl.monthlyPlan,
      value: labelOf(pricing.monthlyPlans, answers.monthlyPlan, 'name'),
      stepIndex: 2,
    },
    {
      label: rl.timeline,
      value: labelOf(pricing.timelineOptions, answers.timeline, 'label'),
      stepIndex: 3,
    },
    {
      label: rl.budget,
      value: labelOf(pricing.budgetRanges, answers.budget, 'label'),
      stepIndex: 4,
    },
    {
      label: rl.contact,
      value: [
        answers.contact.name,
        answers.contact.email,
        answers.contact.phone,
        answers.contact.company,
      ]
        .filter(Boolean)
        .join(' · '),
      stepIndex: 5,
    },
  ]

  /* ---------- Success ---------- */
  if (status === 'success') {
    return (
      <div className="container-site grid gap-12 pb-section lg:grid-cols-12">
        <div className="lg:col-span-7">
          <BriefSuccess
            eyebrow={copy.success.eyebrow}
            title={copy.success.title(answers.contact.name)}
            body={copy.success.body}
            steps={copy.success.steps}
            urgent={copy.success.urgent}
            whatsapp={whatsapp}
            primary={copy.success.home}
            secondary={copy.success.work}
          />
        </div>
        {estimate.ready && (
          <div className="lg:col-span-4 lg:col-start-9">
            <EstimatePanel estimate={estimate} copy={copy.estimate} />
          </div>
        )}
      </div>
    )
  }

  /* ---------- Step bodies ---------- */
  const stepCopy = copy.steps[step]
  const errorSummaryId = `${formId}-errors`
  const hasErrors = Object.keys(errors).length > 0

  const renderChoices = (field: SingleField) => (
    <fieldset aria-describedby={errors[field] ? errorSummaryId : undefined}>
      <legend className="visually-hidden">{stepCopy.title}</legend>
      <div className="grid gap-3 sm:grid-cols-2" id={`${formId}-${field}`} tabIndex={-1}>
        {options[field].map((option, i) => (
          <OptionCard
            key={option.value}
            type="radio"
            name={`${formId}-${field}`}
            value={option.value}
            checked={answers[field] === option.value}
            onChange={() => dispatch({ type: 'select', field, value: option.value })}
            label={option.label}
            description={option.description}
            meta={option.meta}
            shortcut={i + 1}
            invalid={Boolean(errors[field])}
          />
        ))}
      </div>
    </fieldset>
  )

  const contactField = (
    field: keyof BriefContact,
    type: 'text' | 'email' | 'tel' = 'text',
    multiline = false,
  ) => {
    const f = copy.fields[field]
    return (
      <BriefField
        id={`${formId}-${field}`}
        label={f.label}
        placeholder={f.placeholder}
        autoComplete={f.autoComplete}
        type={type}
        multiline={multiline}
        required={field === 'name' || field === 'email'}
        value={answers.contact[field]}
        onChange={(value) => dispatch({ type: 'contact', field, value })}
        error={errors[`contact.${field}`]}
      />
    )
  }

  const body = (() => {
    switch (step) {
      case 'type':
        return renderChoices('projectType')
      case 'scope':
        return renderChoices('scope')
      case 'timeline':
        return renderChoices('timeline')
      case 'budget':
        return renderChoices('budget')
      case 'features':
        return (
          <div className="space-y-10">
            <fieldset>
              <legend className="mb-4 eyebrow text-muted">{copy.steps.features.addOnsLabel}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {briefAddOns.map((addOn, i) => (
                  <OptionCard
                    key={addOn.id}
                    type="checkbox"
                    name={`${formId}-features`}
                    value={addOn.id}
                    checked={answers.features.includes(addOn.id)}
                    onChange={() => dispatch({ type: 'toggleFeature', id: addOn.id })}
                    label={addOn.name}
                    description={addOn.description}
                    meta={`+ ${formatPrice(addOn.price)}`}
                    shortcut={i + 1}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 eyebrow text-muted">{copy.steps.features.planLabel}</legend>
              <p className="mb-4 text-small text-muted">{copy.steps.features.planHint}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {pricing.monthlyPlans.map((plan) => (
                  <OptionCard
                    key={plan.id}
                    type="radio"
                    name={`${formId}-plan`}
                    value={plan.id}
                    checked={answers.monthlyPlan === plan.id}
                    onChange={() =>
                      dispatch({ type: 'select', field: 'monthlyPlan', value: plan.id })
                    }
                    label={plan.name}
                    description={plan.tagline}
                    meta={`${formatPrice(plan.pricePerMonth)}${copy.estimate.perMonth}`}
                  />
                ))}
                <OptionCard
                  type="radio"
                  name={`${formId}-plan`}
                  value="none"
                  checked={answers.monthlyPlan === null}
                  onChange={() => dispatch({ type: 'select', field: 'monthlyPlan', value: null })}
                  label={copy.steps.features.noPlan.label}
                  description={copy.steps.features.noPlan.description}
                />
              </div>
            </fieldset>
          </div>
        )
      case 'contact':
        return (
          <div className="grid gap-6 sm:grid-cols-2">
            {contactField('name')}
            {contactField('email', 'email')}
            {contactField('phone', 'tel')}
            {contactField('company')}
            <div className="sm:col-span-2">{contactField('message', 'text', true)}</div>
            <div className="sm:col-span-2">
              <ConsentField
                id={`${formId}-consent`}
                checked={answers.consent}
                onChange={(value) => dispatch({ type: 'consent', value })}
                label={copy.consent.label}
                linkLabel={copy.consent.linkLabel}
                privacyHref={privacyHref}
                note={copy.consent.note}
                error={errors.consent}
              />
            </div>
          </div>
        )
      case 'review':
        return (
          <BriefReview
            rows={reviewRows}
            editLabel={copy.nav.edit}
            onEdit={(i) => dispatch({ type: 'goTo', stepIndex: i })}
          />
        )
    }
  })()

  const singleError = singleFieldFor[step] ? errors[singleFieldFor[step]] : undefined
  const isLast = step === 'review'
  const submitting = status === 'submitting'
  const labels = BRIEF_STEPS.map((s) => copy.stepLabels[s])

  return (
    <div ref={rootRef} className="container-site grid gap-12 pb-section lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <BriefProgress
          current={stepIndex}
          labels={labels}
          label={copy.nav.progressLabel}
          stepOf={copy.nav.stepOf}
        />

        {prefillName && stepIndex > 0 && stepIndex < 2 && (
          <p className="mt-6 flex flex-wrap items-center gap-3 text-small text-muted">
            <span className="size-1.5 bg-orange" aria-hidden="true" />
            {copy.prefill.notice(prefillName)}
            <button
              type="button"
              onClick={() => dispatch({ type: 'goTo', stepIndex: 0 })}
              className="underline underline-offset-4 hover:text-paper"
            >
              {copy.prefill.change}
            </button>
          </p>
        )}

        {/* Delegated shortcuts for the inputs inside (Enter / 1–9); the form itself isn't a control. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <form id={formId} noValidate onSubmit={onSubmit} onKeyDown={onKeyDown} className="mt-12">
          <div data-step-panel="" key={step}>
            <h2 ref={headingRef} tabIndex={-1} className="text-display-lg outline-none">
              {stepCopy.title}
            </h2>
            <p className="mt-4 max-w-[52ch] text-body-lg text-muted">{stepCopy.hint}</p>

            {hasErrors && (
              <p id={errorSummaryId} role="alert" className="mt-6 text-error">
                {singleError ?? copy.errors.summary}
              </p>
            )}

            {status === 'error' && (
              <div role="alert" className="mt-6 rounded-md border border-error p-5">
                <p className="font-semibold text-error">{copy.failure.title}</p>
                <p className="mt-2 text-small text-muted">{copy.failure.body}</p>
              </div>
            )}

            <div className="mt-10">{body}</div>
          </div>

          {/* Honeypot: hidden from people and assistive tech. */}
          <div aria-hidden="true" className="visually-hidden">
            <label htmlFor={`${formId}-website`}>Website</label>
            <input
              ref={honeypotRef}
              id={`${formId}-website`}
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-tone pt-8">
            <div className="flex items-center gap-3">
              {stepIndex > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => dispatch({ type: 'back' })}
                  disabled={submitting}
                >
                  {copy.nav.back}
                </Button>
              )}
              <Button
                type="submit"
                withArrow={!submitting}
                disabled={submitting}
                aria-describedby={hasErrors ? errorSummaryId : undefined}
              >
                {isLast
                  ? submitting
                    ? copy.nav.submitting
                    : status === 'error'
                      ? copy.failure.retry
                      : copy.nav.submit
                  : copy.nav.next}
              </Button>
            </div>
            <p className="hidden eyebrow text-muted md:block" aria-hidden="true">
              {copy.nav.keyboardHint}
            </p>
          </div>
        </form>
      </div>

      <aside className="hidden lg:col-span-4 lg:col-start-9 lg:block">
        <div className="sticky top-[calc(var(--spacing-header)+1.5rem)] space-y-5">
          <EstimatePanel
            estimate={estimate}
            copy={copy.estimate}
            notice={pricing.settings.isPlaceholder ? pricing.settings.placeholderNotice : undefined}
          />
          <BriefAside
            title={copy.aside.title}
            body={copy.aside.body}
            whatsapp={whatsapp}
            email={email}
          />
        </div>
      </aside>

      {/* Mobile: estimate bar with an expandable breakdown, plus WhatsApp below the form. */}
      <div className="lg:hidden">
        <BriefAside
          title={copy.aside.title}
          body={copy.aside.body}
          whatsapp={whatsapp}
          email={email}
        />
      </div>
      <div className="sticky bottom-0 z-40 -mx-(--spacing-gutter) border-t border-tone bg-ink/95 backdrop-blur lg:hidden">
        {drawerOpen && (
          <div id={`${formId}-drawer`} className="max-h-[60svh] overflow-y-auto px-4 pt-4">
            <EstimatePanel
              estimate={estimate}
              copy={copy.estimate}
              compact
              notice={
                pricing.settings.isPlaceholder ? pricing.settings.placeholderNotice : undefined
              }
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => setDrawerOpen((open) => !open)}
          aria-expanded={drawerOpen}
          aria-controls={`${formId}-drawer`}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <span className="eyebrow text-muted">{copy.estimate.mobileToggle}</span>
          <span className="flex items-center gap-3 numeric font-semibold">
            {estimate.ready ? formatPriceRange(estimate.onceLow, estimate.onceHigh) : '—'}
            <span
              aria-hidden="true"
              className={cn('transition-transform', drawerOpen && 'rotate-180')}
            >
              ↑
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}
