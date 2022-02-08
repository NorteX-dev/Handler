"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextMenuInteraction = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var UserContextMenuInteraction = /** @class */ (function () {
    function UserContextMenuInteraction(handler, client, name, options) {
        var _this = this;
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "USER";
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
    UserContextMenuInteraction.prototype.run = function (userContextMenuInteraction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return UserContextMenuInteraction;
}());
exports.UserContextMenuInteraction = UserContextMenuInteraction;
