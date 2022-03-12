"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var Command = /** @class */ (function () {
    /**
     * @param handler The command handler instance
     * @param filename Command name - if unspecified, the filename is taken into consideration
     * @param options Additional command options @see {@link CommandOptions}
     * */
    function Command(handler, filename, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = handler.client;
        this.name = options.name || filename;
        this.description = options.description || "";
        this.category = options.category || "Miscellaneous";
        this.aliases = options.aliases || [];
        this.usage = options.usage || "";
        this.userPermissions = options.userPermissions || [];
        this.userRoles = options.userRoles || [];
        this.botPermissions = options.botPermissions || [];
        this.botRoles = options.botRoles || [];
        this.userCooldown = options.userCooldown || 0;
        this.guildCooldown = options.guildCooldown || 0;
        this.nsfw = options.nsfw || false;
        this.allowDm = options.allowDm || false;
        this.onlyDm = options.onlyDm || false;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        if (this.onlyDm && !this.allowDm)
            this.allowDm = true;
    }
    /**
     * @param message The Discord.js message object
     * @param args The command arguments
     * @param additionalParams Parameters that were passed in runCommand()
     *
     * @override
     * */
    Command.prototype.run = function (message, args) {
        var additionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            additionalParams[_i - 2] = arguments[_i];
        }
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " command is not present.");
    };
    return Command;
}());
exports.Command = Command;
