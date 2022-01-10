"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InteractionExecutionError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "InteractionExecutionError";
        this.code = code;
        this.message = message;
    }
}
exports.default = InteractionExecutionError;
