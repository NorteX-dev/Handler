"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandInteraction = void 0;
const MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
class CommandInteraction {
    constructor(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "CHAT_INPUT";
        this.name = options.name || name;
        this.description = options.description;
        this.options = options.options;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        this.defaultPermission = options.defaultPermission || true;
    }
    run(interaction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    }
}
exports.CommandInteraction = CommandInteraction;
