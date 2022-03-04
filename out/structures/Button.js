"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentInteraction = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var ComponentInteraction = /** @class */ (function () {
    function ComponentInteraction(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.customId = typeof options.customId === "string" ? new RegExp(options.customId) : options.customId;
        if (!this.customId)
            throw new Error("Button: customId is required.");
    }
    /*z
     * @param {Interaction} interaction
     * @override
     * */
    ComponentInteraction.prototype.run = function (interaction) {
        var additionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalParams[_i - 1] = arguments[_i];
        }
        throw new MethodNotOverridenError_1.default("run() method on " + this.customId + " interaction is not present.");
    };
    return ComponentInteraction;
}());
exports.ComponentInteraction = ComponentInteraction;
