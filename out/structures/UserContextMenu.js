"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var UserContextMenu = /** @class */ (function () {
    function UserContextMenu(handler, filename, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = handler.client;
        this.type = "USER";
        this.name = options.name || filename;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
    }
    UserContextMenu.prototype.run = function (userContextMenuInteraction) {
        var additionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalParams[_i - 1] = arguments[_i];
        }
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return UserContextMenu;
}());
exports.default = UserContextMenu;
