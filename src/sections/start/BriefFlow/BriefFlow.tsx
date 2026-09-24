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
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { trackEvent } from '@/lib/analytics'
import { clearDraft, saveDraft } from '@/lib/brief-draft'
import { briefReducer, initBriefState } from '@/lib/brief-reducer'
import { validateBrief, validateStep } from '@/lib/brief-schema'
import {
  displayValue,
  nextStepId,
  prevStepId,
  resolveOptions,
  visibleSteps,
  type OptionData,
} from '@/lib/brief-steps'
import { cn } from '@/lib/cn'
import { estimate, type EstimateData } from '@/lib/estimate'
import { summarizeResult } from '@/lib/estimate-summary'
import { gsap, useGSAP } from '@/lib/gsap'
import { scrollToElement } from '@/lib/lenis'
import { distance, duration, ease } from '@/lib/motion-tokens'
import type { PriceLabels } from '@/lib/offer'
import { submitBrief } from '@/lib/submit-brief'
import { BriefAside } from '@/sections/start/BriefAside'
import { BriefProgress } from '@/sections/start/BriefProgress'
import { BriefSuccess } from '@/sections/start/BriefSuccess'
import { ContactStep } from '@/sections/start/ContactStep'
import { CountStep } from '@/sections/start/CountStep'
import { EstimatePanel } from '@/sections/start/EstimatePanel'
import { MultiChoiceStep } from '@/sections/start/MultiChoiceStep'
import { ReviewStep } from '@/sections/start/ReviewStep'
import { SingleChoiceStep } from '@/sections/start/SingleChoiceStep'
import { TextStep } from '@/sections/start/TextStep'
import type { BriefAnswers, BriefStepConfig } from '@/types'

export interface BriefFlowProps {
  copy: typeof BriefCopy
  steps: BriefStepConfig[]
  data: EstimateData
  priceLabels: PriceLabels
  partnerNote?: string
  initialAnswers: BriefAnswers
  initialStepId: string
  /** Name of what a deep link pre-selected, shown as a notice. */
  prefillName?: string
  privacyHref: string
  whatsapp: { href: string; label: string }
  email: string
}

const TEXT_INPUT =
  'input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea'

/**
 * The quote builder. Steps come from config (data/brief.ts) and branch on the answers;
 * this component owns state, navigation, validation, keyboard shortcuts (Enter continues,
 * 1–9 picks an option), focus, analytics and submission. Each screen is its own component.
 */
export function BriefFlow({
  copy,
  steps,
  data,
  priceLabels,
  partnerNote,
  initialAnswers,
  initialStepId,
  prefillName,
  privacyHref,
  whatsapp,
  email,
}: BriefFlowProps) {
  const [state, dispatch] = useReducer(briefReducer, undefined, () =>
    initBriefState(initialAnswers, initialStepId),
  )
  const { answers, errors, status } = state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const formId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const shownStep = useRef(state.stepId)
  const lastResultKind = useRef<string>('none')

  const ctx = useMemo(() => ({ offerings: data.offerings }), [data.offerings])
  const optionData: OptionData = useMemo(
    () => ({ ...data, labels: { perMonth: copy.estimate.perMonth } }),
    [data, copy.estimate.perMonth],
  )
  const visible = useMemo(() => visibleSteps(steps, answers, ctx), [steps, answers, ctx])
  const stepIndex = Math.max(
    0,
    visible.findIndex((s) => s.id === state.stepId),
  )
  const step = visible[stepIndex] ?? steps[0]
  const result = useMemo(() => estimate(answers, data), [answers, data])

  // Persist the draft (this tab only) so accidental navigation doesn't lose answers.
  useEffect(() => {
    if (status !== 'success') saveDraft(answers)
  }, [answers, status])

  // Result shown (once per result kind): tells us where each path lands.
  useEffect(() => {
    if (result.kind === 'none' || result.kind === lastResultKind.current) return
    lastResultKind.current = result.kind
    trackEvent('Brief result shown', { kind: result.kind, path: answers.path ?? 'none' })
  }, [result.kind, answers.path])

  // On step change: move focus to the question and keep it in view.
  useEffect(() => {
    if (shownStep.current === state.stepId) return
    shownStep.current = state.stepId
    headingRef.current?.focus({ preventScroll: true })
    const top = rootRef.current?.getBoundingClientRect().top ?? 0
    if (rootRef.current && top < 0) scrollToElement(rootRef.current, -100)
  }, [state.stepId])

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
    { scope: rootRef, dependencies: [state.stepId] },
  )

  if (!step) return null
  const options = resolveOptions(step, optionData)

  /* ---------- Navigation ---------- */
  const focusFirstError = (keys: string[]) => {
    const first = keys[0]
    if (!first) return
    const id = first.startsWith('contact.') ? `${formId}-${first.slice(8)}` : `${formId}-${first}`
    const el =
      document.getElementById(id) ??
      rootRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
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
    if (step.id === 'path' && answers.path)
      trackEvent('Brief path selected', { path: answers.path })
    trackEvent('Brief step complete', {
      step: step.id,
      index: stepIndex + 1,
      path: answers.path ?? 'none',
    })
    const next = nextStepId(steps, step.id, answers, ctx)
    if (next) dispatch({ type: 'goTo', stepId: next, direction: 1 })
  }

  const goBack = () => {
    const prev = prevStepId(steps, step.id, answers, ctx)
    if (prev) dispatch({ type: 'goTo', stepId: prev, direction: -1 })
  }

  const reviewRows = visible
    .filter((s) => s.kind !== 'review')
    .map((s) => ({
      label: s.label,
      value: displayValue(s, answers, optionData, copy.review.none),
      stepId: s.id,
    }))

  const recommendation = summarizeResult(result, priceLabels, {
    discovery: copy.estimate.discovery.required,
    consult: copy.estimate.consult.body,
  })

  const submit = async () => {
    // Bots fill hidden fields; humans don't. Pretend success, send nothing.
    if (honeypotRef.current?.value) {
      dispatch({ type: 'success' })
      return
    }
    // Re-check every visible step and jump to the first one with a problem.
    for (const s of visible) {
      const stepErrors = validateStep(s, answers)
      if (Object.keys(stepErrors).length) {
        dispatch({ type: 'goTo', stepId: s.id, direction: -1 })
        dispatch({ type: 'errors', errors: stepErrors })
        return
      }
    }
    const valid = validateBrief(answers)
    if (!valid.ok) {
      dispatch({ type: 'errors', errors: valid.errors })
      return
    }

    dispatch({ type: 'submit' })
    try {
      await submitBrief({
        path: valid.data.path,
        brief: valid.data,
        summary: Object.fromEntries(reviewRows.map((r) => [r.label, r.value])),
        result: { kind: result.kind, recommendation },
        meta: {
          submittedAt: new Date().toISOString(),
          page: window.location.href,
          userAgent: navigator.userAgent,
        },
      })
      trackEvent('Brief submitted', { path: valid.data.path, result: result.kind })
      clearDraft()
      dispatch({ type: 'success' })
    } catch (error) {
      console.error(error)
      trackEvent('Brief submit error', { path: valid.data.path })
      dispatch({ type: 'failure' })
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (status === 'submitting') return
    if (step.kind === 'review') void submit()
    else goNext()
  }

  const choose = (value: string) => {
    if (step.kind !== 'single') return
    dispatch({ type: 'choose', field: step.field, value })
    // A new project type resets the page count to what that type includes.
    if (step.field === 'buildType') {
      const included = data.offerings.find((o) => o.id === value)?.includedPages
      if (included) dispatch({ type: 'count', field: 'pages', value: included })
    }
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
    const option = options[Number(event.key) - 1]
    if (!option) return
    if (step.kind === 'single') {
      event.preventDefault()
      choose(option.value)
    } else if (step.kind === 'multi') {
      event.preventDefault()
      dispatch({ type: 'toggle', field: step.field, value: option.value })
    }
  }

  const panel = (compact: boolean) => (
    <EstimatePanel
      result={result}
      copy={copy.estimate}
      priceLabels={priceLabels}
      partnerNote={partnerNote}
      compact={compact}
    />
  )

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
        {result.kind !== 'none' && (
          <div className="lg:col-span-4 lg:col-start-9">{panel(false)}</div>
        )}
      </div>
    )
  }

  /* ---------- Current step ---------- */
  const errorSummaryId = `${formId}-errors`
  const hasErrors = Object.keys(errors).length > 0
  const fieldId = (field: string) => `${formId}-${field}`

  const body = (() => {
    switch (step.kind) {
      case 'single':
        return (
          <SingleChoiceStep
            id={fieldId(step.field)}
            legend={step.title}
            options={options}
            value={answers[step.field]}
            onChange={choose}
            invalid={Boolean(errors[step.field])}
            describedBy={hasErrors ? errorSummaryId : undefined}
          />
        )
      case 'multi':
        return (
          <MultiChoiceStep
            id={fieldId(step.field)}
            legend={step.title}
            options={options}
            values={answers[step.field]}
            onToggle={(value) => dispatch({ type: 'toggle', field: step.field, value })}
            invalid={Boolean(errors[step.field])}
            describedBy={hasErrors ? errorSummaryId : undefined}
          />
        )
      case 'count': {
        const included =
          step.field === 'pages'
            ? data.offerings.find((o) => o.id === answers.buildType)?.includedPages
            : undefined
        return (
          <CountStep
            id={fieldId(step.field)}
            label={step.title}
            value={answers[step.field]}
            min={step.min}
            max={step.max}
            unit={step.unit}
            onChange={(value) => dispatch({ type: 'count', field: step.field, value })}
            labels={{ decrease: copy.nav.decrease, increase: copy.nav.increase }}
            note={included ? copy.nav.includedPages(included) : undefined}
            error={errors[step.field]}
          />
        )
      }
      case 'text':
        return (
          <TextStep
            id={fieldId(step.field)}
            label={step.label}
            value={answers[step.field]}
            placeholder={step.placeholder}
            onChange={(value) => dispatch({ type: 'text', field: step.field, value })}
            error={errors[step.field]}
          />
        )
      case 'contact':
        return (
          <ContactStep
            idPrefix={formId}
            contact={answers.contact}
            consent={answers.consent}
            errors={errors}
            onContact={(field, value) => dispatch({ type: 'contact', field, value })}
            onConsent={(value) => dispatch({ type: 'consent', value })}
            fields={copy.fields}
            consentCopy={copy.consent}
            privacyHref={privacyHref}
          />
        )
      case 'review':
        return (
          <ReviewStep
            rows={reviewRows}
            editLabel={copy.nav.edit}
            onEdit={(stepId) => dispatch({ type: 'goTo', stepId, direction: -1 })}
          />
        )
    }
  })()

  const singleError =
    step.kind === 'single' || step.kind === 'multi' ? errors[step.field] : undefined
  const isLast = step.kind === 'review'
  const submitting = status === 'submitting'
  const submitLabel = !isLast
    ? copy.nav.next
    : submitting
      ? copy.nav.submitting
      : status === 'error'
        ? copy.failure.retry
        : copy.nav.submit

  return (
    <div ref={rootRef} className="container-site grid gap-12 pb-section lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <BriefProgress
          current={stepIndex}
          labels={visible.map((s) => s.label)}
          label={copy.nav.progressLabel}
          stepOf={copy.nav.stepOf}
        />

        {prefillName && step.id !== 'path' && stepIndex < 3 && (
          <p className="mt-6 flex flex-wrap items-center gap-3 text-small text-muted">
            <span className="size-1.5 bg-orange" aria-hidden="true" />
            {copy.prefill.notice(prefillName)}
            <button
              type="button"
              onClick={() => dispatch({ type: 'goTo', stepId: 'path', direction: -1 })}
              className="underline underline-offset-4 hover:text-paper"
            >
              {copy.prefill.change}
            </button>
          </p>
        )}

        {/* Delegated shortcuts for the inputs inside (Enter / 1–9); the form itself isn't a control. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <form id={formId} noValidate onSubmit={onSubmit} onKeyDown={onKeyDown} className="mt-12">
          <div data-step-panel="" key={step.id}>
            <h2 ref={headingRef} tabIndex={-1} className="text-display-lg outline-none">
              {step.title}
            </h2>
            <p className="mt-4 max-w-[52ch] text-body-lg text-muted">{step.hint}</p>

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
                <Button type="button" variant="secondary" onClick={goBack} disabled={submitting}>
                  {copy.nav.back}
                </Button>
              )}
              <Button
                type="submit"
                withArrow={!submitting}
                disabled={submitting}
                aria-describedby={hasErrors ? errorSummaryId : undefined}
              >
                {submitLabel}
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
          {panel(false)}
          <BriefAside
            title={copy.aside.title}
            body={copy.aside.body}
            whatsapp={whatsapp}
            email={email}
          />
        </div>
      </aside>

      {/* Mobile: WhatsApp below the form, and a sticky estimate bar with an expandable panel. */}
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
            {panel(true)}
          </div>
        )}
        <button
          type="button"
          onClick={() => setDrawerOpen((open) => !open)}
          aria-expanded={drawerOpen}
          aria-controls={`${formId}-drawer`}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <span className="shrink-0 eyebrow text-muted">{copy.estimate.mobileToggle}</span>
          <span className="flex min-w-0 items-center gap-3 numeric text-small font-semibold">
            <span className="truncate">{recommendation || '—'}</span>
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
