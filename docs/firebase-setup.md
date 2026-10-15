# Firebase Setup

Stack Studio stores project briefs and general contact messages in Firestore for the
`stack-studio-2f8a1` Firebase project when the `VITE_FIREBASE_*` values are present in
`.env.local` and in the hosting build environment.

## Collections

- `client_contacts`: the latest contact details for each anonymous Firebase user and normalized email. The document id is `<auth UID>_<SHA-256 email hash>`. Both forms update this collection. The UID scope prevents one visitor from overwriting another visitor's record; a person using another browser can have a second contact document.
- `project_enquiries`: one document per project brief, with its reason, contact snapshot, answers, estimate, source metadata and EmailJS status.
- `contact_enquiries`: one document per general Contact form message, with its subject, message, contact snapshot, consent, source metadata and EmailJS status.

The enquiry collections keep a history. `client_contacts` is the latest view. Every enquiry has
`contactId` linking it to its contact document. Client reads and deletes are denied by the
Firestore rules; staff access requires the Firebase console or an admin service account.

## Console Setup

In the Firebase console for `stack-studio-2f8a1`:

1. Enable Authentication > Sign-in method > Anonymous. This signs visitors in silently for Firestore security rules; it does not show a login or ask them to create an account. Without it, Firebase returns `ADMIN_ONLY_OPERATION` and no form data can be saved.
2. Create a Firestore database in production mode.
3. Copy the web app settings from Project settings > General > Your apps into `VITE_FIREBASE_*` variables locally and in the hosting build environment. Rebuild after changing them.
4. Deploy `firestore.rules` and `firestore.indexes.json` before testing a live form.
5. Set up App Check for the web app with reCAPTCHA v3, then copy the site key to `VITE_FIREBASE_APPCHECK_SITE_KEY`.
6. Turn on App Check enforcement for Firestore after testing a real submission from the deployed domain.

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
firebase deploy --only firestore
npm run build
firebase deploy --only hosting
```

Check a test submission in the Firebase console under both `client_contacts` and the matching
enquiry collection. Confirm `contactId` links them and the enquiry's email status changes from
`pending` to `sent`. If the email fails, the stored enquiry records `failed` for follow-up.

## EmailJS

Follow [emailjs-setup.md](emailjs-setup.md) for the current team template, linked client reply,
PDF download and optional paid-plan PDF attachment configuration.
