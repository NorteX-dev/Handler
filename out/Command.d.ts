import { CommandHandler } from "./CommandHandler";
import { Message } from "discord.js";
interface CommandOptions {
    name: string;
    description?: string;
    category?: string;
    aliases?: Array<string>;
    userPermissions?: Array<string>;
    userRoles?: Array<string>;
    botPermissions?: Array<string>;
    botRoles?: Array<string>;
    userCooldown?: Number;
    guildCooldowns?: Number;
    usage?: string;
    nsfw?: boolean;
    allowDm?: boolean;
    onlyDm?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    disabled?: boolean;
}
export declare class Command {
    handler: CommandHandler;
    client: any;
    name: string;
    description?: string | undefined;
    category: string;
    aliases: Array<string>;
    userPermissions: Array<string>;
    userRoles: Array<string>;
    botPermissions: Array<string>;
    botRoles: Array<string>;
    userCooldown: Number;
    guildCooldowns: Number;
    usage: string;
    nsfw: boolean;
    allowDm: boolean;
    onlyDm: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    disabled: boolean;
    constructor(handler: CommandHandler, client: any, name: string, options?: CommandOptions);
    run(message: Message, args: Array<String>): void;
}
export {};
