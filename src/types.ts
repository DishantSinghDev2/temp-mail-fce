// types.ts

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ── /mailbox/{user} ──────────────────────────────────────────────────────────

export interface MailboxMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  hasAttachment: boolean;
  wasAttachmentStripped: boolean;
  otp: string | null;
  verificationLink: string | null;
}

export interface MailboxData {
  // the message list lives directly on the response, not under "data"
  messages: MailboxMessage[];
  encryptedMailbox: string;
}

// The actual shape returned: success + message + data[] + encryptedMailbox
// (encryptedMailbox is a sibling of "data", not nested inside it)
export interface MailboxResponse {
  success: boolean;
  message: string;
  data: MailboxMessage[];
  encryptedMailbox: string;
}

// ── /mailbox/{user}/message/{id} ─────────────────────────────────────────────

export interface MessageDetail extends MailboxMessage {
  html: string;
  text: string;
  attachments: Attachment[];
}

export interface Attachment {
  filename: string;
  contentType: string;
  size: number;
  // extend as the API reveals more fields
}

export interface SingleMessageResponse {
  success: boolean;
  message: string;
  data: MessageDetail;
}

// ── DELETE /mailbox/{user}/message/{id} ──────────────────────────────────────

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// ── /health ──────────────────────────────────────────────────────────────────

export interface HealthData {
  queued: number;
  denied: number;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  data: HealthData;
}

// ── /domains ─────────────────────────────────────────────────────────────────

export interface DomainsResponse {
  success: boolean;
  data: string[];
}