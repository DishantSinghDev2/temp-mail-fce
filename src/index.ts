import axios, { AxiosInstance } from 'axios';
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

// small guard… because users will pass "john" otherwise :)

function parseMailbox(full: string) {
  if (!full || typeof full !== 'string') {
    throw new TempMailError(
      'Mailbox is required',
      'INVALID_MAILBOX'
    );
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
  private client: AxiosInstance;

  constructor(apiKey: string) {
  if (!apiKey || apiKey.length < 10) {
    throw new TempMailError(
      'Valid RapidAPI key is required',
      'INVALID_API_KEY'
    );
  }

  this.client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000, // don't hang forever
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': RAPID_HOST,
      'x-rapidapi-key': apiKey,
    },
  });
}


  /**
   * Get all available domains
   */
  async getDomains(): Promise<DomainsResponse> {
    try {
      const res = await this.client.get<DomainsResponse>('/domains');
      return res.data;
    } catch (e: any) {
      throw this.handleError(e);
    }
  }

  /**
   * Retrieve mailbox messages
   * mailbox: user@domain.com
   */
  async getMailbox(mailbox: string): Promise<MailboxResponse> {
    try {
      const { user } = parseMailbox(mailbox);
      const res = await this.client.get<MailboxResponse>(`/mailbox/${user}`);
      return res.data;
    } catch (e: any) {
      throw this.handleError(e);
    }
  }

  async getMessage(mailbox: string, messageId: string): Promise<SingleMessageResponse> {
    try {
      const { user } = parseMailbox(mailbox);
      const res = await this.client.get<SingleMessageResponse>(
        `/mailbox/${user}/message/${messageId}`
      );
      return res.data;
    } catch (e: any) {
      throw this.handleError(e);
    }
  }

  async deleteMessage(mailbox: string, messageId: string): Promise<DeleteResponse> {
    try {
      const { user } = parseMailbox(mailbox);
      const res = await this.client.delete<DeleteResponse>(
        `/mailbox/${user}/message/${messageId}`
      );
      return res.data;
    } catch (e: any) {
      throw this.handleError(e);
    }
  }

  async getHealth(): Promise<HealthResponse> {
    try {
      const res = await this.client.get<HealthResponse>('/health');
      return res.data;
    } catch (e: any) {
      throw this.handleError(e);
    }
  }

  private handleError(error: any): TempMailError {
  // Server responded
  if (error.response) {
    const status = error.response.status;
    const msg =
      error.response.data?.message ||
      error.response.statusText ||
      'API request failed';

    return new TempMailError(
      `TempMail API Error: ${msg}`,
      'API_ERROR',
      status,
      error.response.data
    );
  }

  // No response (network, timeout, DNS, etc.)
  if (error.request) {
    return new TempMailError(
      'No response from TempMail API (network/timeout)',
      'NO_RESPONSE'
    );
  }

  // Something else exploded
  return new TempMailError(
    error.message || 'Unexpected error',
    'UNKNOWN_ERROR'
  );
}

}

export default TempMailFCE;
