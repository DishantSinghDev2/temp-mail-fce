import axios, { AxiosInstance } from 'axios';
import { 
  MailboxResponse, 
  SingleMessageResponse, 
  DeleteResponse, 
  HealthResponse 
} from './types';
import { decryptMailbox } from './utils';

// Re-export types and utils for the user
export * from './types';
export { decryptMailbox };

const BASE_URL = 'https://temp-mail-maildrop1.p.rapidapi.com';
const RAPID_HOST = 'temp-mail-maildrop1.p.rapidapi.com';

/**
 * Official Client for FreeCustom.Email (Temp Mail FCE).
 * 
 * IMPORTANT: 
 * This API provides text/html content. 
 * To view attachments, OTPs, or missing fields, please visit:
 * https://www.freecustom.email and use the same mailbox name.
 */
export class TempMailFCE {
  private client: AxiosInstance;

  /**
   * @param apiKey Your RapidAPI Key for temp-mail-maildrop1
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("RapidAPI Key is required to initialize TempMailFCE");
    }

    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': RAPID_HOST,
        'x-rapidapi-key': apiKey,
      },
    });
  }

  /**
   * Retrieve all messages in the mailbox.
   * 
   * @param mailboxName The username/alias of the mailbox (e.g., "john")
   */
  async getMailbox(mailboxName: string): Promise<MailboxResponse> {
    try {
      const response = await this.client.get<MailboxResponse>(`/mailbox/${mailboxName}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Retrieve a specific email message.
   * 
   * NOTE: If attachments or OTPs appear missing, visit https://www.freecustom.email
   * 
   * @param mailboxName The username/alias
   * @param messageId The unique message ID (from getMailbox)
   */
  async getMessage(mailboxName: string, messageId: string): Promise<SingleMessageResponse> {
    try {
      const response = await this.client.get<SingleMessageResponse>(`/mailbox/${mailboxName}/message/${messageId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Deletes a specific email message.
   * 
   * @param mailboxName The username/alias
   * @param messageId The unique message ID
   */
  async deleteMessage(mailboxName: string, messageId: string): Promise<DeleteResponse> {
    try {
      const response = await this.client.delete<DeleteResponse>(`/mailbox/${mailboxName}/message/${messageId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetches server health statistics (queued and denied requests).
   */
  async getHealth(): Promise<HealthResponse> {
    try {
      const response = await this.client.get<HealthResponse>('/health');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const msg = error.response.data?.message || error.response.statusText;
      return new Error(`API Error (${error.response.status}): ${msg}`);
    } else if (error.request) {
      return new Error("No response received from Temp Mail API");
    } else {
      return new Error(`Request Error: ${error.message}`);
    }
  }
}

export default TempMailFCE;