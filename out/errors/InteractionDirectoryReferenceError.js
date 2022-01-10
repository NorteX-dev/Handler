"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InteractionDirectoryReferenceError extends Error {
    constructor(message) {
        super(message);
        this.name = "InteractionDirectoryReferenceError";
        this.message = message;
    }
}
exports.default = InteractionDirectoryReferenceError;
