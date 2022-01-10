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
        this.disabled = options.disabled || false;
    }
    MessageContextMenuInteraction.prototype.run = function (userContextMenuInteraction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return MessageContextMenuInteraction;
}());
exports.MessageContextMenuInteraction = MessageContextMenuInteraction;
