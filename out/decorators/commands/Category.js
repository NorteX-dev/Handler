"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const Command_1 = require("../../structures/Command");
const Category = (category) => (target) => {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @Category decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "category", {
        value: category,
    });
};
exports.Category = Category;
