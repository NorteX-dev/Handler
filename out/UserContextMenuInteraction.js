"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextMenuInteraction = void 0;
const MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
class UserContextMenuInteraction {
    constructor(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "USER";
        this.name = options.name || name;
        this.disabled = options.disabled || false;
    }
    run(userContextMenuInteraction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    }
}
exports.UserContextMenuInteraction = UserContextMenuInteraction;
