/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_CONTACT_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_BRIEF_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_ATTACH_PDF?: string
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
  readonly VITE_FIREBASE_APPCHECK_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
