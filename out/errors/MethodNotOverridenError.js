"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodNotOverridenError = void 0;
class MethodNotOverridenError extends Error {
    constructor(message) {
        super(message);
        this.name = "MethodNotOverriden";
        this.message = message;
    }
}
exports.MethodNotOverridenError = MethodNotOverridenError;
