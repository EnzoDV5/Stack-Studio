# EmailJS setup for Stack Studio

The site now sends project briefs and general contact messages through the existing **Contact Us** EmailJS template, `template_4ru3xiv`. That template sends the team email to `enzo.devittorio5@gmail.com`. Once the reply template is linked in the dashboard, visitors will receive a confirmation containing a copy of what they submitted. Project briefs also include a link to download the branded PDF.

EmailJS sends the linked reply when the main template is called; this uses two requests from the monthly allowance. PDF attachments require a paid plan, so the Free setup uses a download link. [EmailJS auto-replies](https://www.emailjs.com/docs/user-guide/auto-reply/), [EmailJS plans](https://www.emailjs.com/pricing/).

## 1. Update the existing Contact Us template

In **Email Templates**, open **Contact Us** (`template_4ru3xiv`). On the **Content** tab, set:

| Field | Value |
| --- | --- |
| Subject | `{{subject}}` |
| To Email | `enzo.devittorio5@gmail.com` (literal address) |
| From Name | `Stack Studio` |
| From Email | Keep **Use Default Email Address** checked |
| Reply To | `{{reply_to}}` |

Click **Edit Content**, open the HTML/source editor, replace the old body with [team-template.html](emailjs/team-template.html), then **Apply Changes** and **Save**. The body uses `{{{content_html}}}` because the site sends preformatted HTML with every visitor value escaped. Keep the three braces. [EmailJS dynamic variables](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/).

## 2. Create the visitor confirmation

Use the existing **Auto-Reply** template (`template_s8hnkvq`). Set:

| Field | Value |
| --- | --- |
| Template name | `Stack Studio - Message received` |
| Subject | `{{client_subject}}` |
| To Email | `{{client_email}}` (the current `{{email}}` also works; both are supplied by the site) |
| From Name | `Stack Studio` |
| From Email | Keep **Use Default Email Address** checked |
| Reply To | `enzo.devittorio5@gmail.com` |

Replace its content with [client-template.html](emailjs/client-template.html). Remove any sample attachments or images from the preset, then **Save**. In **Auto-Reply → Auto-Reply**, clear the link to Contact Us and save. In **Contact Us → Auto-Reply**, select **Auto-Reply** as the linked template and save. Refresh both tabs to confirm the settings persisted. The visitor template's **Reply To** must be `enzo.devittorio5@gmail.com`, without an extra `e` before `@`.

## 3. Local and hosting configuration

The local `.env.local` has the Public Key, Gmail Service ID and Contact Us Template ID. It uses the same template ID for briefs and contact messages:

```dotenv
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_4ru3xiv
VITE_EMAILJS_BRIEF_TEMPLATE_ID=template_4ru3xiv
VITE_EMAILJS_ATTACH_PDF=false
```

Restart `npm run dev` after changing `.env.local`. Add the same public identifiers to the hosting environment when deploying. Never add an EmailJS Private Key to a `VITE_*` variable.

## 4. Check both paths

1. Send a test message through `/contact` using an email address you control. Confirm it reaches the team inbox and that the linked reply reaches the visitor inbox. Reply to the team email and confirm it addresses the visitor.
2. Send a test brief through `/start`. Confirm the full answers reach the team, the visitor receives the same answers, and the PDF link downloads a readable file.
3. Check **Email History** for two entries per form submission: the team email and the linked reply. Check Spam if either inbox is empty.

The dashboard's **Test It** button may not provide the site's `content_html` variable. Use the site forms for the final test. An accepted EmailJS request confirms EmailJS took the send; inbox delivery still depends on the connected Gmail service.

## Optional PDF attachment on a paid plan

On a paid plan, add a **Dynamic → Variable Attachment** to the Contact Us template with parameter `brief_pdf`, PDF content type and filename `{{brief_pdf_filename}}`, then set `VITE_EMAILJS_ATTACH_PDF=true`. Because the same template also handles contact messages, it is usually cleaner to create a separate brief template before enabling this attachment. The PDF download link already works without an attachment. [EmailJS attachments](https://www.emailjs.com/docs/user-guide/file-attachments/).
