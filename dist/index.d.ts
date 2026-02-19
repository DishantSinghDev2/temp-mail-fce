import { MailboxResponse, SingleMessageResponse, DeleteResponse, HealthResponse, DomainsResponse } from './types';
import { decryptMailbox } from './utils';
export * from './types';
export { decryptMailbox };
export declare class TempMailFCE {
    private client;
    constructor(apiKey: string);
    /**
     * Get all available domains
     */
    getDomains(): Promise<DomainsResponse>;
    /**
     * Retrieve mailbox messages
     * mailbox: user@domain.com
     */
    getMailbox(mailbox: string): Promise<MailboxResponse>;
    getMessage(mailbox: string, messageId: string): Promise<SingleMessageResponse>;
    deleteMessage(mailbox: string, messageId: string): Promise<DeleteResponse>;
    getHealth(): Promise<HealthResponse>;
    private handleError;
}
export default TempMailFCE;
