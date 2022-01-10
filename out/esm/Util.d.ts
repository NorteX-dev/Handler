import { Client } from "discord.js";
export declare class Util {
    private client;
    constructor(client: Client);
    static truncateString(str: string, length?: number, dontAddDots?: boolean): string;
    static truncateArray(arr: Array<any>, length?: number, dontPushMoreItemsString?: boolean): any[];
    static toReadablePermission(permission: string | Array<string>): string | string[];
}
