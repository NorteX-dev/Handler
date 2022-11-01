"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var Command = /** @class */ (function () {
    function Command(handler, filename, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = handler.client;
        this.type = "CHAT_INPUT";
        this.name = options.name || filename;
        this.description = options.description;
        this.category = options.category;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        // Exclusive properties for slash commands
        this.options = options.options;
        this.defaultPermissions = options.defaultPermissions;
    }
    /**
     * @param interaction The Discord.js interaction object
     * @param additionalParams Parameters that were passed in runInteraction()
     *
     * @override
     * */
    Command.prototype.run = function (interaction, additionalParams) {
        throw new MethodNotOverridenError_1.default("run() method on ".concat(this.name, " interaction is not present."));
    };
    return Command;
}());
exports.default = Command;
