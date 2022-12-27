"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomID = void 0;
var Component_1 = require("../../structures/Component");
var CustomID = function (customId) { return function (target) {
    if (!(target.prototype instanceof Component_1.Component)) {
        throw new TypeError("The @CustomID decorator can only be used on Component classes.");
    }
    Object.defineProperty(target.prototype, "customId", {
        value: customId,
    });
}; };
exports.CustomID = CustomID;
