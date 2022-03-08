"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandDirectoryReferenceError extends Error {
    constructor(message) {
        super(message);
        this.name = "MethodNotOverriden";
        this.message = message;
    }
}
exports.default = CommandDirectoryReferenceError;
//# sourceMappingURL=MethodNotOverridenError.js.map