"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextMenu = void 0;
const MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
class UserContextMenu {
    constructor(handler, filename, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = handler.client;
        this.type = "USER";
        this.name = options.name || filename;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
    }
    run(userContextMenuInteraction, ...additionalParams) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    }
}
exports.UserContextMenu = UserContextMenu;
//# sourceMappingURL=UserContextMenu.js.map