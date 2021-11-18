"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageComponentInteraction = void 0;
var MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
var MessageComponentInteraction = /** @class */ (function () {
    function MessageComponentInteraction(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.name = options.name || name;
        this.disabled = options.disabled || false;
    }
    MessageComponentInteraction.prototype.run = function (userContextMenuInteraction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return MessageComponentInteraction;
}());
exports.MessageComponentInteraction = MessageComponentInteraction;
