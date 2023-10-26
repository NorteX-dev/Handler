"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMOnly = void 0;
const Command_1 = require("../../structures/Command");
const DMOnly = (target) => {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @DMOnly decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "dmOnly", {
        value: true,
    });
};
exports.DMOnly = DMOnly;
