export type TempMailErrorCode =
  | 'INVALID_API_KEY'
  | 'INVALID_MAILBOX'
  | 'NETWORK_ERROR'
  | 'NO_RESPONSE'
  | 'API_ERROR'
  | 'UNKNOWN_ERROR';

export class TempMailError extends Error {
  code: TempMailErrorCode;
  status?: number;
  details?: any;

  constructor(message: string, code: TempMailErrorCode, status?: number, details?: any) {
    super(message);
    this.name = 'TempMailError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
