"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContextMenu = void 0;
const MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
class MessageContextMenu {
    constructor(handler, filename, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = handler.client;
        this.type = "MESSAGE";
        this.name = options.name || filename;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
    }
    run(userContextMenuInteraction, ...additionalParams) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    }
}
exports.MessageContextMenu = MessageContextMenu;
//# sourceMappingURL=MessageContextMenu.js.map