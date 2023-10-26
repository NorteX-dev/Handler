"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIDs = void 0;
const Command_1 = require("../../structures/Command");
const UserIDs = (userIds) => (target) => {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @UserIDs decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "userIds", {
        value: userIds,
    });
};
exports.UserIDs = UserIDs;
