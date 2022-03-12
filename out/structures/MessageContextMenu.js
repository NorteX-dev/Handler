"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContextMenu = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var MessageContextMenu = /** @class */ (function () {
    function MessageContextMenu(handler, filename, options) {
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
    MessageContextMenu.prototype.run = function (userContextMenuInteraction) {
        var additionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalParams[_i - 1] = arguments[_i];
        }
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return MessageContextMenu;
}());
exports.MessageContextMenu = MessageContextMenu;
