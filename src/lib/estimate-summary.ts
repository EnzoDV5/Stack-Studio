/**
 * One-line, human-readable version of an estimate result, for the mobile estimate bar
 * and the submission payload. Copy is passed in, never hardcoded.
 */
import type { EstimateResult } from './estimate'
import { formatPrice, formatPriceRange } from './format'
import { planPrice, ratePrice, type PriceLabels } from './offer'

export interface SummaryCopy {
  discovery: (price: string) => string
  consult: string
  partnerConsult?: string
}

export function summarizeResult(result: EstimateResult, l: PriceLabels, copy: SummaryCopy): string {
  switch (result.kind) {
    case 'none':
      return ''
    case 'range':
      return formatPriceRange(result.low, result.high, 1_000)
    case 'discovery':
      return copy.discovery(formatPrice(result.discovery.fromPrice))
    case 'audit':
      return `${result.audit.name} ${result.auditIsFrom ? `${l.from.toLowerCase()} ` : ''}${formatPrice(result.audit.fromPrice)}`
    case 'plan': {
      const parts = result.plans.map((p) => `${p.name} ${planPrice(p, l)}`)
      if (result.hourlyRate)
        parts.unshift(`${result.hourlyRate.name} ${ratePrice(result.hourlyRate, l)}`)
      return parts.join(' / ')
    }
    case 'consult':
      return result.topic === 'partner' ? (copy.partnerConsult ?? copy.consult) : copy.consult
  }
}
