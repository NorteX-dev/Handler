"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = void 0;
var Command_1 = require("../../structures/Command");
var Options = function (options) { return function (target) {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @Options decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "options", {
        value: options,
    });
}; };
exports.Options = Options;
