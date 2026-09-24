/**
 * The ONLY file that reads import.meta.env. See .env.example.
 */
const env = import.meta.env

function read(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export const config = {
  /** POST target for the Start a project brief (Formspree or similar). null uses the local stub. */
  formEndpoint: read(env.VITE_FORM_ENDPOINT),
  /** Plausible-style site id (domain). null disables analytics entirely. */
  analyticsId: read(env.VITE_ANALYTICS_ID),
  /** Plausible-compatible script. Swap for a self-hosted Plausible or Umami-compatible proxy. */
  analyticsScriptSrc: 'https://plausible.io/js/script.manual.js',
  isDev: env.DEV,
} as const
