"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var Component = /** @class */ (function () {
    function Component() {
    }
    Component.prototype.run = function (interaction, additionalParams) {
        throw new MethodNotOverridenError_1.MethodNotOverridenError("run() method on ".concat(this.customId, " interaction is not present."));
    };
    return Component;
}());
exports.Component = Component;
