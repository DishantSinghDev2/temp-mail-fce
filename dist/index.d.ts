import { MailboxResponse, SingleMessageResponse, DeleteResponse, HealthResponse } from './types';
import { decryptMailbox } from './utils';
export * from './types';
export { decryptMailbox };
/**
 * Official Client for FreeCustom.Email (Temp Mail FCE).
 *
 * IMPORTANT:
 * This API provides text/html content.
 * To view attachments, OTPs, or missing fields, please visit:
 * https://www.freecustom.email and use the same mailbox name.
 */
export declare class TempMailFCE {
    private client;
    /**
     * @param apiKey Your RapidAPI Key for temp-mail-maildrop1
     */
    constructor(apiKey: string);
    /**
     * Retrieve all messages in the mailbox.
     *
     * @param mailboxName The username/alias of the mailbox (e.g., "john")
     */
    getMailbox(mailboxName: string): Promise<MailboxResponse>;
    /**
     * Retrieve a specific email message.
     *
     * NOTE: If attachments or OTPs appear missing, visit https://www.freecustom.email
     *
     * @param mailboxName The username/alias
     * @param messageId The unique message ID (from getMailbox)
     */
    getMessage(mailboxName: string, messageId: string): Promise<SingleMessageResponse>;
    /**
     * Deletes a specific email message.
     *
     * @param mailboxName The username/alias
     * @param messageId The unique message ID
     */
    deleteMessage(mailboxName: string, messageId: string): Promise<DeleteResponse>;
    /**
     * Fetches server health statistics (queued and denied requests).
     */
    getHealth(): Promise<HealthResponse>;
    private handleError;
}
export default TempMailFCE;
