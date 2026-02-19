/**
 * Decrypts the encrypted mailbox ID returned by the API.
 *
 * @param encryptedMailbox The 'D-xxxxx' string returned from the API
 * @returns The original mailbox name (alphanumeric only)
 */
export declare function decryptMailbox(encryptedMailbox: string): string;
