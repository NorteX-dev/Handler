import MessageCommandHandler from "../handlers/MessageCommandHandler";
interface CommandOptions {
    name: string;
    description?: string;
    category?: string;
    aliases?: Array<string>;
    userPermissions?: Array<string>;
    userRoles?: Array<string>;
    botPermissions?: Array<string>;
    botRoles?: Array<string>;
    userCooldown?: number;
    guildCooldown?: number;
    usage?: string;
    nsfw?: boolean;
    allowDm?: boolean;
    onlyDm?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    disabled?: boolean;
}
export default class MessageCommand {
    handler: MessageCommandHandler;
    client: any;
    name: string;
    description?: string | undefined;
    category: string;
    aliases: string[];
    userPermissions: string[];
    userRoles: string[];
    botPermissions: string[];
    botRoles: Array<string>;
    userCooldown: number;
    guildCooldown: number;
    usage: string;
    nsfw: boolean;
    allowDm: boolean;
    onlyDm: boolean;
    userIds: string[];
    guildIds: string[];
    disabled: boolean;
    /**
     * @param handler The command handler instance
     * @param filename MessageCommand name - if unspecified, the filename is taken into consideration
     * @param options Additional command options @see {@link CommandOptions}
     * */
    constructor(handler: MessageCommandHandler, filename: string, options?: CommandOptions);
    /**
     * @param message The Discord.js message object
     * @param args The command arguments
     * @param additionalParams Parameters that were passed in runCommand()
     *
     * @override
     * */
    run(message: any, args?: Array<String>, additionalParams?: any): void;
}
export {};
