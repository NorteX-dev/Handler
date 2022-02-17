"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContextMenuInteraction = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var MessageContextMenuInteraction = /** @class */ (function () {
    function MessageContextMenuInteraction(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "MESSAGE";
        this.name = options.name || name;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
    }
    MessageContextMenuInteraction.prototype.run = function (userContextMenuInteraction) {
        var additionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalParams[_i - 1] = arguments[_i];
        }
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return MessageContextMenuInteraction;
}());
exports.MessageContextMenuInteraction = MessageContextMenuInteraction;
