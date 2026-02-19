// index.ts
import { 
  MailboxResponse,
  SingleMessageResponse,
  DeleteResponse,
  HealthResponse,
  DomainsResponse
} from './types';
import { decryptMailbox } from './utils';
import { TempMailError } from './errors';

export * from './types';
export { decryptMailbox };

const BASE_URL = 'https://temp-mail-maildrop1.p.rapidapi.com';
const RAPID_HOST = 'temp-mail-maildrop1.p.rapidapi.com';

function parseMailbox(full: string) {
  if (!full || typeof full !== 'string') {
    throw new TempMailError('Mailbox is required', 'INVALID_MAILBOX');
  }

  const parts = full.split('@');

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new TempMailError(
      'Mailbox must be in format: user@domain.com',
      'INVALID_MAILBOX'
    );
  }

  return {
    user: parts[0].toLowerCase(),
    domain: parts[1].toLowerCase(),
  };
}

export class TempMailFCE {
  private apiKey: string;
  private timeout: number;

  constructor(apiKey: string, timeout = 15000) {
    if (!apiKey || apiKey.length < 10) {
      throw new TempMailError('Valid RapidAPI key is required', 'INVALID_API_KEY');
    }
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': RAPID_HOST,
          'x-rapidapi-key': this.apiKey,
          ...options.headers,
        },
      });

      // Server responded with error status
      if (!res.ok) {
        let body: any;
        try { body = await res.json(); } catch { body = undefined; }

        throw new TempMailError(
          `TempMail API Error: ${body?.message ?? res.statusText}`,
          'API_ERROR',
          res.status,
          body
        );
      }

      return res.json() as Promise<T>;
    } catch (e: any) {
      // Already a TempMailError (e.g. thrown above) — rethrow as-is
      if (e instanceof TempMailError) throw e;

      // AbortController fired — timeout
      if (e.name === 'AbortError') {
        throw new TempMailError(
          'No response from TempMail API (network/timeout)',
          'NO_RESPONSE'
        );
      }

      // Network failure (DNS, refused, etc.)
      if (e instanceof TypeError) {
        throw new TempMailError(
          'No response from TempMail API (network/timeout)',
          'NO_RESPONSE'
        );
      }

      throw new TempMailError(e.message ?? 'Unexpected error', 'UNKNOWN_ERROR');
    } finally {
      clearTimeout(timer);
    }
  }

  async getDomains(): Promise<DomainsResponse> {
    return this.request<DomainsResponse>('/domains');
  }

  async getMailbox(mailbox: string): Promise<MailboxResponse> {
    const { user } = parseMailbox(mailbox);
    return this.request<MailboxResponse>(`/mailbox/${user}`);
  }

  async getMessage(mailbox: string, messageId: string): Promise<SingleMessageResponse> {
    const { user } = parseMailbox(mailbox);
    return this.request<SingleMessageResponse>(`/mailbox/${user}/message/${messageId}`);
  }

  async deleteMessage(mailbox: string, messageId: string): Promise<DeleteResponse> {
    const { user } = parseMailbox(mailbox);
    return this.request<DeleteResponse>(`/mailbox/${user}/message/${messageId}`, {
      method: 'DELETE',
    });
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }
}

export default TempMailFCE;