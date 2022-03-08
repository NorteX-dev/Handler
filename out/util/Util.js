"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    constructor(client) {
        this.client = client;
    }
    /**
     * Truncates an string to a maximum length.
     *
     * @param str String to transform
     * @param length Maximum length of the string - default 100
     * @param dontAddDots If true, won't add the 3 dots at the end - default false
     * */
    static truncateString(str, length = 100, dontAddDots = false) {
        return str.length > length ? str.slice(0, length) + `${dontAddDots ? "" : "..."}` : str;
    }
    /**
     * Trims an array to a maximum length
     *
     * @param arr Array to transform
     * @param length Maximum length of the array - default 10
     * @param dontPushMoreItemsString If true, won't push the "x more items..." string into the array - default false
     * */
    static truncateArray(arr, length = 10, dontPushMoreItemsString = false) {
        if (arr.length > length) {
            const sliced = arr.slice(0, length);
            if (!dontPushMoreItemsString)
                sliced.push(arr.length - length + " more items...");
            return sliced;
        }
        else
            return arr;
    }
    /**
     * Transforms a PermissionResolvable (or an array of them) name(s) (such as "MANAGE_GUILD") to a more user-friendly style: "Manage Guild".
     *
     * @param permission The permission flag (or array of flags) to transform
     * */
    static toReadablePermission(permission) {
        if (!Array.isArray(permission))
            return permission
                .toLowerCase()
                .replace(/_/g, " ")
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
        else
            return permission.map((perm) => {
                return perm
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ");
            });
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map