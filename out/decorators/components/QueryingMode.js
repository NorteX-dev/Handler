"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryingMode = void 0;
var Component_1 = require("../../structures/Component");
var QueryingMode = function (queryingMode) { return function (target) {
    if (!(target.prototype instanceof Component_1.Component)) {
        throw new TypeError("The @QueryingMode decorator can only be used on Component classes.");
    }
    if (!["exact", "startsWith", "includes"].includes(queryingMode))
        throw new Error("@QueryingMode: Invalid querying mode. Valid modes are: exact, startsWith, includes.");
    Object.defineProperty(target.prototype, "queryingMode", {
        value: queryingMode,
    });
}; };
exports.QueryingMode = QueryingMode;
