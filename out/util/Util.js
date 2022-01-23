"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
var Util = /** @class */ (function () {
    function Util(client) {
        this.client = client;
    }
    /**
     * Truncates an string to a maximum length.
     *
     * @param str String to transform
     * @param length Maximum length of the string - default 100
     * @param dontAddDots If true, won't add the 3 dots at the end - default false
     * */
    Util.truncateString = function (str, length, dontAddDots) {
        if (length === void 0) { length = 100; }
        if (dontAddDots === void 0) { dontAddDots = false; }
        return str.length > length ? str.slice(0, length) + "".concat(dontAddDots ? "" : "...") : str;
    };
    /**
     * Trims an array to a maximum length
     *
     * @param arr Array to transform
     * @param length Maximum length of the array - default 10
     * @param dontPushMoreItemsString If true, won't push the "x more items..." string into the array - default false
     * */
    Util.truncateArray = function (arr, length, dontPushMoreItemsString) {
        if (length === void 0) { length = 10; }
        if (dontPushMoreItemsString === void 0) { dontPushMoreItemsString = false; }
        if (arr.length > length) {
            var sliced = arr.slice(0, length);
            if (!dontPushMoreItemsString)
                sliced.push(arr.length - length + " more items...");
            return sliced;
        }
        else
            return arr;
    };
    /**
     * Transforms a PermissionResolvable (or an array of them) name(s) (such as "MANAGE_GUILD") to a more user-friendly style: "Manage Guild".
     *
     * @param permission The permission flag (or array of flags) to transform
     * */
    Util.toReadablePermission = function (permission) {
        if (!Array.isArray(permission))
            return permission
                .toLowerCase()
                .replace(/_/g, " ")
                .split(" ")
                .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
                .join(" ");
        else
            return permission.map(function (perm) {
                return perm
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .split(" ")
                    .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
                    .join(" ");
            });
    };
    return Util;
}());
exports.Util = Util;
