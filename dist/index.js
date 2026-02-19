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
const errors_1 = require("./errors");
__exportStar(require("./types"), exports);
const BASE_URL = 'https://temp-mail-maildrop1.p.rapidapi.com';
const RAPID_HOST = 'temp-mail-maildrop1.p.rapidapi.com';
// small guard… because users will pass "john" otherwise :)
function parseMailbox(full) {
    if (!full || typeof full !== 'string') {
        throw new errors_1.TempMailError('Mailbox is required', 'INVALID_MAILBOX');
    }
    const parts = full.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        throw new errors_1.TempMailError('Mailbox must be in format: user@domain.com', 'INVALID_MAILBOX');
    }
    return {
        user: parts[0].toLowerCase(),
        domain: parts[1].toLowerCase(),
    };
}
class TempMailFCE {
    constructor(apiKey) {
        if (!apiKey || apiKey.length < 10) {
            throw new errors_1.TempMailError('Valid RapidAPI key is required', 'INVALID_API_KEY');
        }
        this.client = axios_1.default.create({
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
    async getDomains() {
        try {
            const res = await this.client.get('/domains');
            return res.data;
        }
        catch (e) {
            throw this.handleError(e);
        }
    }
    /**
     * Retrieve mailbox messages
     * mailbox: user@domain.com
     */
    async getMailbox(mailbox) {
        try {
            const { user } = parseMailbox(mailbox);
            const res = await this.client.get(`/mailbox/${user}`);
            return res.data;
        }
        catch (e) {
            throw this.handleError(e);
        }
    }
    async getMessage(mailbox, messageId) {
        try {
            const { user } = parseMailbox(mailbox);
            const res = await this.client.get(`/mailbox/${user}/message/${messageId}`);
            return res.data;
        }
        catch (e) {
            throw this.handleError(e);
        }
    }
    async deleteMessage(mailbox, messageId) {
        try {
            const { user } = parseMailbox(mailbox);
            const res = await this.client.delete(`/mailbox/${user}/message/${messageId}`);
            return res.data;
        }
        catch (e) {
            throw this.handleError(e);
        }
    }
    async getHealth() {
        try {
            const res = await this.client.get('/health');
            return res.data;
        }
        catch (e) {
            throw this.handleError(e);
        }
    }
    handleError(error) {
        var _a;
        // Server responded
        if (error.response) {
            const status = error.response.status;
            const msg = ((_a = error.response.data) === null || _a === void 0 ? void 0 : _a.message) ||
                error.response.statusText ||
                'API request failed';
            return new errors_1.TempMailError(`TempMail API Error: ${msg}`, 'API_ERROR', status, error.response.data);
        }
        // No response (network, timeout, DNS, etc.)
        if (error.request) {
            return new errors_1.TempMailError('No response from TempMail API (network/timeout)', 'NO_RESPONSE');
        }
        // Something else exploded
        return new errors_1.TempMailError(error.message || 'Unexpected error', 'UNKNOWN_ERROR');
    }
}
exports.TempMailFCE = TempMailFCE;
exports.default = TempMailFCE;
