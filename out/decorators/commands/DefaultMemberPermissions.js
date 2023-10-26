"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMemberPermissions = void 0;
const Command_1 = require("../../structures/Command");
const DefaultMemberPermissions = (bitfield) => (target) => {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @DefaultMemberPermissions decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "defaultMemberPermissions", {
        value: bitfield,
    });
};
exports.DefaultMemberPermissions = DefaultMemberPermissions;
