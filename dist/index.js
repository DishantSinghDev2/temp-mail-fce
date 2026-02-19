"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempMailFCE = exports.decryptMailbox = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
Object.defineProperty(exports, "decryptMailbox", { enumerable: true, get: function () { return utils_1.decryptMailbox; } });
// Re-export types and utils for the user
__exportStar(require("./types"), exports);
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
class TempMailFCE {
    /**
     * @param apiKey Your RapidAPI Key for temp-mail-maildrop1
     */
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("RapidAPI Key is required to initialize TempMailFCE");
        }
        this.client = axios_1.default.create({
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
    async getMailbox(mailboxName) {
        try {
            const response = await this.client.get(`/mailbox/${mailboxName}`);
            return response.data;
        }
        catch (error) {
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
    async getMessage(mailboxName, messageId) {
        try {
            const response = await this.client.get(`/mailbox/${mailboxName}/message/${messageId}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Deletes a specific email message.
     *
     * @param mailboxName The username/alias
     * @param messageId The unique message ID
     */
    async deleteMessage(mailboxName, messageId) {
        try {
            const response = await this.client.delete(`/mailbox/${mailboxName}/message/${messageId}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Fetches server health statistics (queued and denied requests).
     */
    async getHealth() {
        try {
            const response = await this.client.get('/health');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    handleError(error) {
        var _a;
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const msg = ((_a = error.response.data) === null || _a === void 0 ? void 0 : _a.message) || error.response.statusText;
            return new Error(`API Error (${error.response.status}): ${msg}`);
        }
        else if (error.request) {
            return new Error("No response received from Temp Mail API");
        }
        else {
            return new Error(`Request Error: ${error.message}`);
        }
    }
}
exports.TempMailFCE = TempMailFCE;
exports.default = TempMailFCE;
