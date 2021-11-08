"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = void 0;
var MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
var Interaction = /** @class */ (function () {
    function Interaction(handler, client, name, options) {
        var _a;
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = ((_a = options.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "command";
        this.name = options.name || name;
        this.description = options.description;
        this.options = options.options;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        this.defaultPermission = options.defaultPermission || true;
        if (!["command", "usercontext", "rolecontext"].includes(this.type))
            throw new Error("Bad type specified: " + this.type);
    }
    Interaction.prototype.run = function (interaction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return Interaction;
}());
exports.Interaction = Interaction;
