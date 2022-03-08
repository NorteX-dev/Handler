"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DirectoryReferenceError extends Error {
    constructor(message) {
        super(message);
        this.name = "DirectoryReference";
        this.message = message;
    }
}
exports.default = DirectoryReferenceError;
//# sourceMappingURL=DirectoryReferenceError.js.map