"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextMenuInteraction = void 0;
var MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
var UserContextMenuInteraction = /** @class */ (function () {
    function UserContextMenuInteraction(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "USER";
        this.name = options.name || name;
        this.disabled = options.disabled || false;
    }
    UserContextMenuInteraction.prototype.run = function (userContextMenuInteraction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return UserContextMenuInteraction;
}());
exports.UserContextMenuInteraction = UserContextMenuInteraction;
