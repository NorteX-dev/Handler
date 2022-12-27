"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMOnly = void 0;
var Command_1 = require("../../structures/Command");
var DMOnly = function (target) {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @DMOnly decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "dmOnly", {
        value: true,
    });
};
exports.DMOnly = DMOnly;
