"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var Component = /** @class */ (function () {
    function Component(handler, filename, options) {
        if (!options)
            options = {};
        if (!options.customId)
            throw new Error("Component (".concat(filename, "): customId is required."));
        if (!options.queryingMode)
            options.queryingMode = "exact";
        this.handler = handler;
        this.client = handler.client;
        this.queryingMode = options.queryingMode || "exact";
        this.type = "COMPONENT";
        this.customId = options.customId;
        if (!["exact", "includes", "startsWith"].includes(options.queryingMode))
            throw new Error(filename + ": Invalid querying mode for component interaction. Querying mode must be one of: exact, includes, startsWith.");
    }
    /*
     * @param {Interaction} interaction
     * @override
     * */
    Component.prototype.run = function (interaction) {
        var additionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalParams[_i - 1] = arguments[_i];
        }
        throw new MethodNotOverridenError_1.default("run() method on " + this.customId + " interaction is not present.");
    };
    return Component;
}());
exports.Component = Component;
