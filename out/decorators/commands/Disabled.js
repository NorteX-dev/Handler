"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disabled = void 0;
const Command_1 = require("../../structures/Command");
const Disabled = (target) => {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @Disabled decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "disabled", {
        value: true,
    });
};
exports.Disabled = Disabled;
