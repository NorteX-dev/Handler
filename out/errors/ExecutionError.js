"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionError = void 0;
class ExecutionError extends Error {
    constructor(message, code, ...params) {
        super(message);
        this.name = "ExecutionError";
        this.code = code;
        this.message = message;
        this.params = params;
    }
}
exports.ExecutionError = ExecutionError;
