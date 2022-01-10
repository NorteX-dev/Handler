"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContextMenuInteraction = void 0;
const MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
class MessageContextMenuInteraction {
    constructor(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "MESSAGE";
        this.name = options.name || name;
        this.disabled = options.disabled || false;
    }
    run(userContextMenuInteraction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    }
}
exports.MessageContextMenuInteraction = MessageContextMenuInteraction;
