"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandExecutionError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "CommandExecutionError";
        this.code = code;
        this.message = message;
    }
}
exports.default = CommandExecutionError;
