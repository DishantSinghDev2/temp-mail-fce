# temp-mail-fce

The official Node.js, React, and Next.js compatible wrapper for the [FreeCustom.Email](https://freecustom.email) Temp Mail API. Fully typed with TypeScript support.

[![NPM](https://nodei.co/npm/temp-mail-fce.png)](https://nodei.co/npm/temp-mail-fce/)

## ⚠️ Important Usage Notice

The API provides access to email metadata, HTML, and text content. 
**To view Attachments, OTPs, or any missing fields, you must visit:**
👉 **[www.freecustom.email](https://www.freecustom.email)** 

Simply enter the same mailbox name used in the API to view the full content.

## Prerequisites

You need a RapidAPI key to use this module.
**[Buy API Key Here](https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1)**

## Installation

```bash
npm install temp-mail-fce
# or
yarn add temp-mail-fce
```

## Quick Start (Node.js / React / Next.js)

```typescript
import { TempMailFCE } from 'temp-mail-fce';

// Initialize with your RapidAPI Key
const api = new TempMailFCE('YOUR_RAPID_API_KEY');

const main = async () => {
  const mailboxName = 'testuser';

  // 1. Get Mailbox Messages
  const mailbox = await api.getMailbox(mailboxName);
  console.log(`Encrypted ID: ${mailbox.encryptedMailbox}`);
  
  if (mailbox.data.length > 0) {
    const emailId = mailbox.data[0].id;
    console.log(`Found email from: ${mailbox.data[0].from}`);

    // 2. Get Specific Message Content
    const message = await api.getMessage(mailboxName, emailId);
    console.log('Subject:', message.data.subject);
    console.log('HTML Content:', message.data.html);
    
    // Note: For attachments, visit www.freecustom.email
  } else {
    console.log('Mailbox is empty');
  }
};

main();
```

## API Reference

### `getMailbox(name: string)`
Retrieves all messages for a specific user.
- **Returns:** List of messages and the `encryptedMailbox` ID.

### `getMessage(name: string, id: string)`
Retrieves the full content (HTML/Text) of a specific message.
- **Note:** Does not return attachments (see Usage Notice).

### `deleteMessage(name: string, id: string)`
Deletes a message permanently.

### `getHealth()`
Check API server status, queued messages, and denied request counts.

### Utilities: `decryptMailbox(encryptedId: string)`
Decrypts the `encryptedMailbox` ID returned by the API back to the original alphanumeric string.

```typescript
import { decryptMailbox } from 'temp-mail-fce';

const original = decryptMailbox("D-1tvd0i7g79sx52l1jui");
console.log(original); // e.g., "dishant"
```

## Types

The module exports fully typed interfaces for TypeScript users:
- `MailboxResponse`
- `MessageSummary`
- `SingleMessageResponse`
- `HealthResponse`

## Support

- [Live Site](https://freecustom.email)
- [API Documentation](https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1)

---
*Powered by Dishis Technologies*