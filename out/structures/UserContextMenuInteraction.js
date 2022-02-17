"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextMenuInteraction = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var UserContextMenuInteraction = /** @class */ (function () {
    function UserContextMenuInteraction(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "USER";
        this.name = options.name || name;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
    }
    UserContextMenuInteraction.prototype.run = function (userContextMenuInteraction) {
        var additionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalParams[_i - 1] = arguments[_i];
        }
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return UserContextMenuInteraction;
}());
exports.UserContextMenuInteraction = UserContextMenuInteraction;
