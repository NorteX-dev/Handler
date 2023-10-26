"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Description = void 0;
const Command_1 = require("../../structures/Command");
const Description = (description) => (target) => {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @Description decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "description", {
        value: description,
    });
};
exports.Description = Description;
