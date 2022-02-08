"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandInteraction = void 0;
var MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
var CommandInteraction = /** @class */ (function () {
    function CommandInteraction(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.name = options.name || name;
        this.description = options.description;
        this.options = options.options;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        this.defaultPermission = options.defaultPermission || true;
    }
    CommandInteraction.prototype.run = function (interaction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return CommandInteraction;
}());
exports.CommandInteraction = CommandInteraction;
