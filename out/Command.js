"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
class Command {
    constructor(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.name = options.name || name;
        this.description = options.description || "Empty";
        this.category = options.category || "Miscellaneous";
        this.aliases = options.aliases || [];
        this.usage = options.usage || "";
        this.userPermissions = options.userPermissions || [];
        this.userRoles = options.userRoles || [];
        this.botPermissions = options.botPermissions || [];
        this.botRoles = options.botRoles || [];
        this.userCooldown = options.userCooldown || 0;
        this.guildCooldowns = options.guildCooldowns || 0;
        this.nsfw = options.nsfw || false;
        this.allowDm = options.allowDm || false;
        this.onlyDm = options.onlyDm || false;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        if (this.onlyDm && !this.allowDm)
            this.allowDm = true;
    }
    run(message, args) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " command is not present.");
    }
}
exports.Command = Command;
