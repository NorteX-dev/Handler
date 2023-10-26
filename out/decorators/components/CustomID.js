"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomID = exports.QueryingMode = void 0;
const Component_1 = require("../../structures/Component");
var QueryingMode;
(function (QueryingMode) {
    QueryingMode["Exact"] = "exact";
    QueryingMode["StartsWith"] = "startsWith";
    QueryingMode["Includes"] = "includes";
})(QueryingMode = exports.QueryingMode || (exports.QueryingMode = {}));
const CustomID = (customId, queryingMode = QueryingMode.Exact) => (target) => {
    if (!(target.prototype instanceof Component_1.Component)) {
        throw new TypeError("The @CustomID decorator can only be used on Component classes.");
    }
    Object.defineProperty(target.prototype, "customId", {
        value: customId,
    });
    Object.defineProperty(target.prototype, "queryingMode", {
        value: queryingMode,
    });
};
exports.CustomID = CustomID;
