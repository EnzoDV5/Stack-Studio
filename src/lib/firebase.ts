import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { config } from './config'

interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  userId: string
}

let appCheckStarted = false

function options(): FirebaseOptions | null {
  if (!config.firebase) return null

  return {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId ?? undefined,
    appId: config.firebase.appId,
    measurementId: config.firebase.measurementId ?? undefined,
  }
}

function firebaseApp(): FirebaseApp {
  const firebaseOptions = options()
  if (!firebaseOptions) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values.')

  return getApps().length ? getApp() : initializeApp(firebaseOptions)
}

function startAppCheck(app: FirebaseApp): void {
  const siteKey = config.firebase?.appCheckSiteKey
  if (!siteKey || appCheckStarted || typeof window === 'undefined') return

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  })
  appCheckStarted = true
}

export function hasFirebaseConfig(): boolean {
  return Boolean(options())
}

export async function firebaseServices(): Promise<FirebaseServices> {
  const app = firebaseApp()
  startAppCheck(app)

  const auth = getAuth(app)
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user

  return {
    app,
    auth,
    db: getFirestore(app),
    userId: user.uid,
  }
}
