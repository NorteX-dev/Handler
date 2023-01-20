"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomID = exports.QueryingMode = void 0;
var Component_1 = require("../../structures/Component");
var QueryingMode;
(function (QueryingMode) {
    QueryingMode["Exact"] = "exact";
    QueryingMode["StartsWith"] = "startsWith";
    QueryingMode["Includes"] = "includes";
})(QueryingMode = exports.QueryingMode || (exports.QueryingMode = {}));
var CustomID = function (customId, queryingMode) {
    if (queryingMode === void 0) { queryingMode = QueryingMode.Exact; }
    return function (target) {
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
};
exports.CustomID = CustomID;
