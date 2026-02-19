"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempMailError = void 0;
class TempMailError extends Error {
    constructor(message, code, status, details) {
        super(message);
        this.name = 'TempMailError';
        this.code = code;
        this.status = status;
        this.details = details;
    }
}
exports.TempMailError = TempMailError;
