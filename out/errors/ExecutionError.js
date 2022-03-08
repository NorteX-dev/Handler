"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExecutionError extends Error {
    constructor(message, code, ...params) {
        super(message);
        this.name = "InteractionExecutionError";
        this.code = code;
        this.message = message;
        this.params = params;
    }
}
exports.default = ExecutionError;
//# sourceMappingURL=ExecutionError.js.map