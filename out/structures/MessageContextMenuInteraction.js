"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContextMenuInteraction = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var MessageContextMenuInteraction = /** @class */ (function () {
    function MessageContextMenuInteraction(handler, client, name, options) {
        var _this = this;
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "MESSAGE";
        this.name = options.name || name;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        this.opts = {}; // Initialize
        Object.keys(options).forEach(function (key) {
            if (["name", "description", "options", "userIds", "guildIds", "disabled", "defaultPermission"].includes(key)) {
                return;
            }
            // @ts-ignore
            _this.opts[key] = options[key];
        });
    }
    MessageContextMenuInteraction.prototype.run = function (userContextMenuInteraction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return MessageContextMenuInteraction;
}());
exports.MessageContextMenuInteraction = MessageContextMenuInteraction;
