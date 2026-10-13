/**
 * The ONLY file that reads import.meta.env. See .env.example.
 */
const env = import.meta.env

function read(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

const firebaseApiKey = read(env.VITE_FIREBASE_API_KEY)
const firebaseProjectId = read(env.VITE_FIREBASE_PROJECT_ID)
const firebaseAppId = read(env.VITE_FIREBASE_APP_ID)

const firebase =
  firebaseApiKey && firebaseProjectId && firebaseAppId
    ? {
        apiKey: firebaseApiKey,
        authDomain: read(env.VITE_FIREBASE_AUTH_DOMAIN) ?? `${firebaseProjectId}.firebaseapp.com`,
        projectId: firebaseProjectId,
        storageBucket: read(env.VITE_FIREBASE_STORAGE_BUCKET) ?? `${firebaseProjectId}.appspot.com`,
        messagingSenderId: read(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
        appId: firebaseAppId,
        measurementId: read(env.VITE_FIREBASE_MEASUREMENT_ID),
        appCheckSiteKey: read(env.VITE_FIREBASE_APPCHECK_SITE_KEY),
      }
    : null

const emailjsPublicKey = read(env.VITE_EMAILJS_PUBLIC_KEY)
const emailjsServiceId = read(env.VITE_EMAILJS_SERVICE_ID)
const emailjsBriefTemplateId = read(env.VITE_EMAILJS_BRIEF_TEMPLATE_ID)

const emailjs =
  emailjsPublicKey && emailjsServiceId && emailjsBriefTemplateId
    ? {
        publicKey: emailjsPublicKey,
        serviceId: emailjsServiceId,
        briefTemplateId: emailjsBriefTemplateId,
        toEmail: read(env.VITE_EMAILJS_TO_EMAIL) ?? 'hello@stackstudio.co.za',
      }
    : null

export const config = {
  /** POST target for the Start a project brief (Formspree or similar). null uses the local stub. */
  formEndpoint: read(env.VITE_FORM_ENDPOINT),
  /** Firebase web app settings. null keeps the brief flow in local/form-endpoint mode. */
  firebase,
  /** EmailJS settings for team notifications and linked auto-replies. */
  emailjs,
  /** Plausible-style site id (domain). null disables analytics entirely. */
  analyticsId: read(env.VITE_ANALYTICS_ID),
  /** Plausible-compatible script. Swap for a self-hosted Plausible or Umami-compatible proxy. */
  analyticsScriptSrc: 'https://plausible.io/js/script.manual.js',
  isDev: env.DEV,
} as const
