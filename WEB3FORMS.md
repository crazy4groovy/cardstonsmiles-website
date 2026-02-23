# Web3Forms Integration Guide

This document explains how to use [Web3Forms](https://web3forms.com) to receive contact form submissions via email—no backend required.

## Overview

Web3Forms is a free form backend service that forwards form submissions to your email. It works with static sites (like Astro) because it uses a third-party API endpoint instead of your own server.

---

## Quick Start

### 1. Get an Access Key

1. Go to [web3forms.com](https://web3forms.com/#start)
2. Enter the email address where you want to receive submissions
3. Submit the form—you’ll receive your **Access Key** by email
4. Copy the key (it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 2. Configure Your Form

Point your form to the Web3Forms API and include the access key:

```html
<form action="https://api.web3forms.com/submit" method="POST">
  <!-- Required: Your access key -->
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">

  <!-- Your form fields (any names you want) -->
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>

  <button type="submit">Send Message</button>
</form>
```

### 3. Test

Submit the form in a browser. You should receive an email with the submitted data.

---

## Reserved Fields (Optional)

These field names have special behavior. Use them as needed:

| Field         | Type   | Description                                                                 |
|---------------|--------|-----------------------------------------------------------------------------|
| `access_key`  | string | **Required.** Your Web3Forms access key.                                    |
| `email`       | string | User email. Used as the Reply-To address in your notification email.       |
| `subject`     | string | Email subject. Can be user-filled or a hidden default.                      |
| `from_name`   | string | Name shown as sender (default: "Notifications").                            |
| `redirect`    | string | URL to redirect to after success (for non-JavaScript submissions).           |
| `botcheck`    | hidden | Honeypot for spam protection. Add as hidden checkbox with `display:none`.   |
| `replyto`     | string | Override Reply-To if you don’t want to use the `email` field.               |
| `ccemail`     | string | *(PRO)* CC another email address.                                          |
| `webhook`     | string | *(PRO)* Webhook URL for integrations (Zapier, Notion, etc.).                |

Any other field names are sent through as custom data and appear in your email.

---

## Project Integration: ContactForm.astro

The `ContactForm.astro` component is wired to Web3Forms. It:

- Sets `action` to `https://api.web3forms.com/submit` via JavaScript
- Adds a hidden `access_key` input
- Sends: `name`, `email`, `phone`, `subject`, `message`

### Current Setup

```astro
<form action="#" method="POST">
  <input type="hidden" name="form-name" value="contact-form" />
  <!-- name, email, phone, subject, message fields -->
</form>

<script is:inline>
  const form = document.querySelector("form");
  form.setAttribute("action", "https://api.web3forms.com/submit");
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "access_key";
  hiddenInput.value = "YOUR_ACCESS_KEY";  // Replace with your key
  form.appendChild(hiddenInput);
</script>
```

### Using an Environment Variable (Recommended)

Avoid committing the access key. Use an environment variable:

1. Add to `.env` (and `.env.example` for documentation):

   ```
   PUBLIC_WEB3FORMS_ACCESS_KEY=your-access-key-here
   ```

2. In Astro, pass it via a prop or `define:vars`:

   ```astro
   <script define:vars={{ accessKey: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY }}>
     const form = document.querySelector("form");
     form.setAttribute("action", "https://api.web3forms.com/submit");
     const hiddenInput = document.createElement("input");
     hiddenInput.type = "hidden";
     hiddenInput.name = "access_key";
     hiddenInput.value = accessKey;
     form.appendChild(hiddenInput);
   </script>
   ```

---

## Optional Enhancements

### Honeypot Spam Protection

Add a hidden checkbox that bots may fill out:

```html
<input type="checkbox" name="botcheck" style="display: none;">
```

Web3Forms ignores submissions where this field is checked.

### Custom Subject Line

```html
<input type="hidden" name="subject" value="New Contact from Cardston Smiles">
```

### Success Redirect (No JavaScript)

For plain HTML form posts (no JS):

```html
<input type="hidden" name="redirect" value="https://yoursite.com/thank-you">
```

### Custom From Name

```html
<input type="hidden" name="from_name" value="Cardston Smiles Website">
```

---

## API Reference

- **Endpoint:** `POST https://api.web3forms.com/submit`
- **Alternative:** `POST https://api.web3forms.com/submit/YOUR_ACCESS_KEY` (access key in URL, no hidden field needed)

### Response Codes

| Code | Meaning                                      |
|------|----------------------------------------------|
| 200  | Success (JSON response)                      |
| 303  | Success with redirect                        |
| 400  | Client error (invalid data, missing key)     |
| 429  | Too many requests (rate limit)               |
| 500  | Server error                                 |

### Success Response (200)

```json
{
  "success": true,
  "body": {
    "data": { "name": "...", "email": "...", "message": "..." },
    "message": "Email sent successfully!"
  }
}
```

---

## Troubleshooting

| Issue                    | Possible cause / fix                                      |
|--------------------------|-----------------------------------------------------------|
| No email received        | Check spam folder; verify access key and recipient email. |
| 400 error                | Ensure `access_key` is present and valid.                 |
| 429 error                | Rate limit hit; wait and retry.                           |
| Form submits but no JSON | Form may be doing a full-page POST; check `action`/`method`. |

---

## Resources

- [Web3Forms](https://web3forms.com)
- [Documentation](https://docs.web3forms.com)
- [API Reference](https://docs.web3forms.com/getting-started/api-reference)
