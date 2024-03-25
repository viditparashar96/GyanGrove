"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(status, message = "Success", data = null) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = true;
    }
}
exports.ApiResponse = ApiResponse;
