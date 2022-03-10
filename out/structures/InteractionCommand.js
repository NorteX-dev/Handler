"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionCommand = void 0;
const MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
class InteractionCommand {
    constructor(handler, filename, options) {
        if (!options)
            options = {};
        if (!options.name || !options.description)
            throw new Error("CommandInteraction: name & description are required.");
        this.handler = handler;
        this.client = handler.client;
        this.type = "CHAT_INPUT";
        this.name = options.name || filename;
        this.description = options.description;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        // Exclusive properties for slash commands
        this.options = options.options;
        this.defaultPermission = options.defaultPermission || true;
        this.permissions = options.permissions || [];
    }
    run(interaction, ...additionalParams) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    }
}
exports.InteractionCommand = InteractionCommand;
