"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message = "Internal server error", errors = [], stack) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
