# Firebase Setup

Stack Studio stores completed brief submissions in Firestore for the `stack-studio-2f8a1`
Firebase project when the `VITE_FIREBASE_*` values are present in `.env.local`.

## Collections

- `client_contacts`: one contact document per email address, using a SHA-256 email hash as the document id.
- `project_enquiries`: one document per submitted brief, with the project reason, contact snapshot, estimate, source metadata and EmailJS automation status.

## Console Setup

In the Firebase console for `stack-studio-2f8a1`:

1. Enable Authentication > Sign-in method > Anonymous.
2. Create a Firestore database in production mode.
3. Set up App Check for the web app with reCAPTCHA v3, then copy the site key to `VITE_FIREBASE_APPCHECK_SITE_KEY`.
4. Turn on App Check enforcement for Firestore after testing a real submission.

## CLI Project Selection

The Firebase CLI account must be able to see the Stack-Studio project before this repo can be linked.

```sh
firebase login:add
firebase login:use your-google-account@example.com
firebase projects:list
firebase use default
```

This repo already has `.firebaserc` pointing at `stack-studio-2f8a1`. The account selected
with `firebase login:use` still needs access to that project.

## Deploy

```sh
npm run build
firebase deploy --only firestore,hosting
```

## EmailJS

Follow [emailjs-setup.md](emailjs-setup.md) for the current team template, linked client reply,
PDF download and optional paid-plan PDF attachment configuration.
