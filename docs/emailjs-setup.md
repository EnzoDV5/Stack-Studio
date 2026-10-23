# Stack Studio EmailJS setup

The site uses one team template for every brief path (new build, existing-project help, care plan, Partner, and not sure) and the general Contact form. Its linked auto-reply sends each visitor a copy of their own submission. The shared template fields change the subject and introduction for each path, including care-plan-only enquiries. The team recipient and reply address are `stackstudio26@gmail.com`.

## Correct the settings shown in the screenshots

The screenshots show older dashboard settings. Update **Contact Us → To Email** from `enzo.devittorio03@gmail.com` to `stackstudio26@gmail.com` if the studio inbox is the intended destination. The Gmail service may stay connected to `enzo.devittorio5@gmail.com`: the sending account and receiving inbox do not have to match. Keep **Use Default Email Address** checked on both templates.

Use the exact fields and HTML below. In particular, the team subject should be `{{subject}}`, and the confirmation subject should be `{{client_subject}}`. The site still supplies `email`, `title`, `name`, `time`, `client_first_name`, and `content_html` for the older templates shown, so those older variable names alone do not explain a failed request.

Keep **Contact Us → Auto-Reply → Auto-Reply** linked. Clear **Auto-Reply → Auto-Reply → Contact Us** and save both templates. EmailJS ignores chained links; linking both ways is unnecessary and does not prove that a loop caused the error. [EmailJS linked-template rules](https://www.emailjs.com/docs/user-guide/auto-reply/).

## Diagnose an actual send error

Check the failed entry in **Email History**, including the linked confirmation entry. The website now retains the provider's status and text in the developer console and saved email status, while showing a readable error to visitors.

| Error/detail                                                                | Fix                                                                                                                                                |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail API, insufficient authentication scopes, OAuth, or expired connection | Reconnect Gmail under **Email Services → Stack Studio** and grant **Send email on your behalf**. Run the service test afterward.                   |
| Invalid public key, service ID, or template ID                              | Compare **Account → API Keys**, the service ID, and template IDs with `.env.local`; restart Vite after changing values.                            |
| Empty or invalid recipient                                                  | Check the fixed team inbox and the confirmation's `{{client_email}}`; a dashboard test must supply a real address for that variable.               |
| Origin/domain blocked                                                       | Check the EmailJS origin allowlist against the exact local or hosted origin being used.                                                            |
| 429 / too many requests                                                     | Wait and retry once. The site queues sends with at least 1.1 seconds between starts.                                                               |
| Monthly quota reached                                                       | Wait for quota renewal or change the EmailJS plan. Repeated retries cannot restore quota.                                                          |
| Template variables exceed 50 KB                                             | Shorten the free-text message or send it directly by email. The site checks UTF-8 size before sending and preserves the original answers.          |
| Network/fetch failure                                                       | Check connectivity and browser request blocking; check Email History before retrying because an interrupted response can leave delivery uncertain. |

The site cannot update your EmailJS dashboard or prove inbox delivery from local tests. A successful API response confirms acceptance of the main request; verify both messages and their Reply-To addresses in real inboxes.

The current EmailJS Free account has two templates and does not support attachments. Brief emails therefore include a **Download your PDF brief** link; the same branded PDF is available on the success page. A real PDF attachment requires a paid plan and the extra setup below. [EmailJS pricing](https://www.emailjs.com/pricing/).

## 1. Team notification: Contact Us

Open **Email Templates → Contact Us** (`template_4ru3xiv`) and set these fields on **Content**:

| Field      | Value                                      |
| ---------- | ------------------------------------------ |
| To Email   | `stackstudio26@gmail.com`                  |
| From Name  | `Stack Studio`                             |
| From Email | Keep **Use Default Email Address** checked |
| Reply To   | `{{reply_to}}`                             |
| Subject    | `{{subject}}`                              |

Select **Edit Content**, open the HTML/source editor, and paste [team-template.html](emailjs/team-template.html). Apply the content change, then click **Save** on the template page. The subject will identify normal enquiries, briefs, and partnership enquiries. The body contains every answer and, for briefs, a PDF download link.

## 2. Visitor confirmation: Auto-Reply

Open **Email Templates → Auto-Reply** (`template_s8hnkvq`) and set:

| Field      | Value                                      |
| ---------- | ------------------------------------------ |
| To Email   | `{{client_email}}`                         |
| From Name  | `Stack Studio`                             |
| From Email | Keep **Use Default Email Address** checked |
| Reply To   | `stackstudio26@gmail.com`                  |
| Subject    | `{{client_subject}}`                       |

Paste [client-template.html](emailjs/client-template.html) into its HTML/source editor, apply, and **Save**. Leave **Auto-Reply → Auto-Reply** unlinked. Then open **Contact Us → Auto-Reply**, select **Auto-Reply** as the linked template, and **Save**. Refresh both templates to check the settings persisted. One form submission then uses two EmailJS requests: the team email and the visitor confirmation. [EmailJS auto-replies](https://www.emailjs.com/docs/user-guide/auto-reply/).

The triple braces around `content_html` are intentional: the site escapes every visitor value before building this HTML. Keep `{{{content_html}}}` in both templates. [EmailJS template variables](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/).

## 3. Logo and PDF link

Both templates use `{{logo_url}}`, which the site sets to `https://stack-studio.web.app/StackLogo2.png`. The artwork is in `public/StackLogo2.png` and is included in the Hosting build. The text **STACK STUDIO** also remains visible in the email header. Check the image URL directly in a private browser window after deployment.

The brief PDF link opens `https://stack-studio.web.app/brief` and downloads the PDF, even when the form is submitted locally. The updated site must be deployed to that Hosting site for the link to work. The link includes the submitted answers in the URL fragment; it works without making the Firestore records public. Change the site URL to `https://stackstudio.co.za` only when that domain serves the site.

## 4. Site configuration

The local `.env.local` already has the EmailJS public identifiers. For hosting, set the same values:

```dotenv
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=service_ih66e1h
VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_4ru3xiv
VITE_EMAILJS_BRIEF_TEMPLATE_ID=template_4ru3xiv
VITE_EMAILJS_ATTACH_PDF=false
```

Restart the development server after changing `.env.local`. Do not put an EmailJS Private Key in a `VITE_*` variable.

## 5. Test delivery and the linked auto-reply

1. Submit `/contact` with an email address you control. Confirm the team email reaches `stackstudio26@gmail.com`, the visitor receives the confirmation with the submitted message, and replying to each email addresses the right person.
2. Submit `/start` as a normal project brief. Confirm both emails include all the answers, the reference and the PDF download link.
3. Submit `/start?path=develop` as a partnership enquiry. Confirm the subject says **Partnership enquiry**, the visitor text mentions the partnership, and both emails include the submitted details.
4. Submit `/start?plan=care-essential` and `/start?plan=managed-app` as care-plan enquiries. Confirm the emails describe hosting and care, include the selected plan in both HTML and plain text, and do not describe a new build.
5. Check the existing-project-help and not-sure paths too. Each uses the same main template, with the answers and client reply address supplied by the site.
6. In EmailJS **Email History**, look for the main and linked message for each test. A successful browser request confirms EmailJS accepted the send, but the inbox still needs checking.

The dashboard's **Test It** button may omit the site's `content_html` variable. Use the site forms for the final test. Keep test submissions clearly marked so their Firestore records can be removed afterward.

The browser sends only the main template; EmailJS sends the linked auto-reply. Do not add a
second client-side request for the auto-reply. Both forms share a minimum 1.1-second send
interval, including retries, rather than a storage-based ten-second lockout. Requests are
not retried automatically, to avoid sending duplicate mail after an uncertain response.
Failed sends retain the answers and saved enquiry for a manual retry. Back, Edit, and the ×
buttons clear the visible error state without clearing those answers. Template configuration,
service availability, account quota, and final inbox delivery still need checking in EmailJS.

### Local regression checks

Run `npm test` for template data, HTML escaping, PDF records, provider errors, request size, and send-queue checks. Run `npm run test:email` for a browser check of the Contact form's failed send and manual retry, plus the email request for all five brief paths. This browser check uses dummy EmailJS identifiers, disables Firebase only inside the test page, intercepts every external request, and sends no real emails. It verifies the request and UI behavior; it does not verify Gmail delivery or dashboard templates.

The browser check needs Chrome or Chromium. Set `CHROME_PATH=/path/to/chrome npm run test:email` to use a different executable if the installed browser fails to launch.

## Actual PDF attachments (paid EmailJS plan)

The Free plan cannot attach a PDF. On a plan with attachments, create a separate **Brief** team template and set `VITE_EMAILJS_BRIEF_TEMPLATE_ID` to its new ID. Give it the same team recipient, subject, HTML body and linked Auto-Reply template as above. In the Brief template's **Attachments** tab, add a **Dynamic → Variable Attachment** with parameter name `brief_pdf`, content type PDF, and filename `{{brief_pdf_filename}}`. Then set `VITE_EMAILJS_ATTACH_PDF=true` in the site environment and redeploy. The code already creates the branded PDF and passes it as a Base64 data URL to EmailJS. Keep the Contact Us template without a PDF attachment. [EmailJS variable attachments](https://www.emailjs.com/docs/user-guide/file-attachments/).

If the visitor also needs an attached PDF, configure the same variable attachment in the linked Auto-Reply template and test both inboxes. EmailJS says linked templates share dynamic attachments; confirm the delivered result with a real submission before relying on it. [EmailJS linked templates](https://www.emailjs.com/docs/user-guide/auto-reply/).
