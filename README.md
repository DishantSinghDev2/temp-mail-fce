# temp-mail-fce

The official Node.js, React, and Next.js compatible wrapper for the [FreeCustom.Email](https://freecustom.email) Temp Mail API. Fully typed with TypeScript support.

[![NPM](https://nodei.co/npm/temp-mail-fce.png)](https://nodei.co/npm/temp-mail-fce/)

---

## ⚠️ Important Usage Notice

The API provides access to email metadata, HTML, and text content.

**To view Attachments, OTPs, or any missing fields, visit:**
👉 **https://www.freecustom.email**

Enter the **same full mailbox email** used in the API to view complete content.

---

## ⚠️ Mailbox Format Requirement

All mailbox operations now require the **full email address**:

```
user@domain.com
```

Example:

```
john@ditapi.info
```

If you don’t know available domains, use:

```
getDomains()
```

---

## Prerequisites

You need a RapidAPI key to use this module.
**Get your free key:**
https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1

---

## Installation

```bash
npm install temp-mail-fce
# or
yarn add temp-mail-fce
```

---

## Quick Start (Node.js / React / Next.js)

```ts
import { TempMailFCE } from 'temp-mail-fce';

const api = new TempMailFCE('YOUR_RAPID_API_KEY');

const main = async () => {
  // 1. Get available domains
  const { domains } = await api.getDomains();
  console.log('Available domains:', domains);

  // 2. Use full email format
  const mailboxEmail = `testuser@${domains[0]}`;

  // 3. Get Mailbox Messages
  const mailbox = await api.getMailbox(mailboxEmail);
  console.log(`Encrypted ID: ${mailbox.encryptedMailbox}`);

  if (mailbox.data.length > 0) {
    const emailId = mailbox.data[0].id;
    console.log(`Found email from: ${mailbox.data[0].from}`);

    // 4. Get specific message
    const message = await api.getMessage(mailboxEmail, emailId);
    console.log('Subject:', message.data.subject);
    console.log('HTML:', message.data.html);

    // For attachments or OTPs → visit freecustom.email
  } else {
    console.log('Mailbox is empty');
  }
};

main();
```

---

## API Reference

### `getDomains()`

Returns all available domains you can use.

**Example response**

```ts
{
  domains: ["ditapi.info", "maildrop.cc"]
}
```

---

### `getMailbox(email: string)`

Retrieve all messages for a mailbox.

**Parameter**

* `email`: Full email (e.g., `user@ditapi.info`)

**Returns**

* Message list
* `encryptedMailbox` identifier

---

### `getMessage(email: string, id: string)`

Retrieve full HTML/Text content of a message.

**Note**
Attachments and some OTP formats are only visible on the website.

---

### `deleteMessage(email: string, id: string)`

Deletes a specific message permanently.

---

### `getHealth()`

Returns API server health, queue stats, and denied request counts.

---

## Utilities

### `decryptMailbox(encryptedId: string)`

Decrypt the `encryptedMailbox` ID back to the original mailbox name.

```ts
import { decryptMailbox } from 'temp-mail-fce';

const original = decryptMailbox("D-1tvd0i7g79sx52l1jui");
console.log(original); // e.g., "testuser"
```

---

## Types

Fully typed interfaces are included:

* `MailboxResponse`
* `MessageSummary`
* `SingleMessageResponse`
* `DeleteResponse`
* `HealthResponse`
* `DomainsResponse`

---
## Detailed Usage Examples

---

### Example 1 — Generate a Temp Email Automatically

```ts
import { TempMailFCE } from 'temp-mail-fce';

const api = new TempMailFCE(process.env.RAPID_KEY!);

async function createEmail() {
  const { domains } = await api.getDomains();

  const username = 'user' + Math.floor(Math.random() * 100000);
  const email = `${username}@${domains[0]}`;

  console.log('Temp Email:', email);
}

createEmail();
```

---

### Example 2 — Poll for OTP (Common Use Case)

```ts
async function waitForEmail(email: string, timeout = 60000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const mailbox = await api.getMailbox(email);

    if (mailbox.data.length > 0) {
      const msgId = mailbox.data[0].id;
      const message = await api.getMessage(email, msgId);

      console.log('Subject:', message.data.subject);
      console.log('Content:', message.data.text);

      return message;
    }

    await new Promise(r => setTimeout(r, 5000));
  }

  throw new Error('Timeout waiting for email');
}
```

---

### Example 3 — Delete All Messages

```ts
async function clearInbox(email: string) {
  const mailbox = await api.getMailbox(email);

  for (const msg of mailbox.data) {
    await api.deleteMessage(email, msg.id);
  }

  console.log('Inbox cleared');
}
```

---

### Example 4 — Health Monitoring

```ts
const health = await api.getHealth();

console.log('Queued:', health.queue);
console.log('Denied:', health.denied);
```

---

### Example 5 — Error Handling (Recommended)

```ts
import { TempMailError } from 'temp-mail-fce';

try {
  await api.getMailbox('invalid-email');
} catch (e) {
  if (e instanceof TempMailError) {
    console.error(e.code);    // e.g. INVALID_MAILBOX
    console.error(e.message);
    console.error(e.status);
  } else {
    console.error('Unknown error', e);
  }
}
```

---

## Best Practice Flow

```
1. getDomains()
2. Create email: user@domain
3. Use email for signup/OTP
4. Poll getMailbox()
5. Fetch content with getMessage()
6. Delete when done
```


---

## Support

* Live Site: https://freecustom.email
* API Docs: https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1

---

*Powered by Dishis Technologies*
