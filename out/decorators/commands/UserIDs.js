"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIDs = void 0;
var Command_1 = require("../../structures/Command");
var UserIDs = function (userIds) { return function (target) {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @UserIDs decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "userIds", {
        value: userIds,
    });
}; };
exports.UserIDs = UserIDs;
