import bigInt from 'big-integer';

const ALTINBOX_MOD = bigInt("20190422");

/**
 * Decrypts the encrypted mailbox ID returned by the API.
 * 
 * @param encryptedMailbox The 'D-xxxxx' string returned from the API
 * @returns The original mailbox name (alphanumeric only)
 */
export function decryptMailbox(encryptedMailbox: string): string {
  if (!encryptedMailbox || !encryptedMailbox.startsWith("D-")) {
    throw new Error("Invalid encrypted mailbox format. Must start with D-");
  }

  // Remove the prefix
  const withoutPrefix = encryptedMailbox.slice(2); // Remove 'D-'
  
  // Convert from base36 to a number
  const decryptedNum = bigInt(withoutPrefix, 36);
  
  // Subtract the private modifier
  const adjustedNum = decryptedNum.subtract(ALTINBOX_MOD);
  
  // Convert back to string, remove the leading '1', and reverse it
  const numString = adjustedNum.toString();
  const reversedString = numString.slice(1).split("").reverse().join("");
  
  // Convert back to original base 36 (only alphanumeric characters)
  // Note: Based on provided docs, this extracts the alphanumeric name
  const originalMailbox = reversedString.replace(/[^0-9a-z]/gi, '');

  return originalMailbox;
}