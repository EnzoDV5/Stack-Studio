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

The website sends the team notification through one EmailJS template. The client auto-reply
should be linked from that main template in EmailJS, which consumes one extra request but
keeps the website integration clean.

Create:

- Service: connect the email account that should send Stack Studio mail.
- Main template: team notification, with Template ID copied to `VITE_EMAILJS_BRIEF_TEMPLATE_ID`.
- Linked auto-reply template: sent to `{{client_email}}`.
- Main template attachment: add a Variable Attachment named `brief_pdf`, filename `{{brief_pdf_filename}}`, content type PDF.

Main template variables available:

```txt
{{title}}
{{to_email}}
{{client_name}}
{{client_email}}
{{client_phone}}
{{client_company}}
{{client_message}}
{{reply_to}}
{{enquiry_reason}}
{{project_path}}
{{estimate_kind}}
{{recommendation}}
{{submitted_at}}
{{page_url}}
{{summary_text}}
{{contact_id}}
{{enquiry_id}}
{{brief_pdf_filename}}
```

For the main template, set Reply-To to `{{reply_to}}`. For the linked auto-reply, set
To Email to `{{client_email}}`.
