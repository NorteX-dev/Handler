"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPermissions = void 0;
var Command_1 = require("../../structures/Command");
var DefaultPermissions = function (defaultPermissions) { return function (target) {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @DefaultPermissions decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "defaultPermissions", {
        value: defaultPermissions,
    });
}; };
exports.DefaultPermissions = DefaultPermissions;
