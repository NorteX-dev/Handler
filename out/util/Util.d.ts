import { Client } from "discord.js";
export declare class Util {
    private client;
    constructor(client: Client);
    /**
     * Truncates an string to a maximum length.
     *
     * @param str String to transform
     * @param length Maximum length of the string - default 100
     * @param dontAddDots If true, won't add the 3 dots at the end - default false
     * */
    static truncateString(str: string, length?: number, dontAddDots?: boolean): string;
    /**
     * Trims an array to a maximum length
     *
     * @param arr Array to transform
     * @param length Maximum length of the array - default 10
     * @param dontPushMoreItemsString If true, won't push the "x more items..." string into the array - default false
     * */
    static truncateArray(arr: Array<any>, length?: number, dontPushMoreItemsString?: boolean): any[];
    /**
     * Transforms a PermissionResolvable (or an array of them) name(s) (such as "MANAGE_GUILD") to a more user-friendly style: "Manage Guild".
     *
     * @param permission The permission flag (or array of flags) to transform
     * */
    static toReadablePermission(permission: string | Array<string>): string | string[];
}
