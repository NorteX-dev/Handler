"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryReferenceError = void 0;
class DirectoryReferenceError extends Error {
    constructor(message) {
        super(message);
        this.name = "DirectoryReference";
        this.message = message;
    }
}
exports.DirectoryReferenceError = DirectoryReferenceError;
