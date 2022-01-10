"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventDirectoryReferenceError extends Error {
    constructor(message) {
        super(message);
        this.name = "EventDirectoryReferenceError";
        this.message = message;
    }
}
exports.default = EventDirectoryReferenceError;
