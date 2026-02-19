export interface MessageSummary {
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

export interface MailboxResponse {
  success: boolean;
  message: string;
  data: MessageSummary[];
  encryptedMailbox: string;
}

export interface MessageDetail {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  hasAttachment: boolean;
  wasAttachmentStripped: boolean;
  html: string;
  text: string;
  attachments: any[]; // Attachments are stripped in API, view on site
}

export interface SingleMessageResponse {
  success: boolean;
  message: string;
  data: MessageDetail;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface HealthStats {
  queued: number;
  denied: number;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  data: HealthStats;
}

export interface DomainsResponse {
  domains: string[];
}
