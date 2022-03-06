import { CommandHandler } from "../handlers/CommandHandler";
import { Message } from "discord.js";
/**
 * @interface CommandOptions
 * Additional command options
 *
 * @example
 * ```js
 *module.exports = class BanCommand extends Command {
 *	constructor(...args) {
 *		super(...args, {
 *			name: "ban",
 *			description: "Ban a guild member.",
 *			category: "Moderation",
 *			aliases: ["guildban"],
 *			userPermissions: ["MANAGE_GUILD"],
 *			userRoles: ["293857324908345"],
 *			botPermissions: ["MANAGE_GUILD"],
 *			botRoles: [],
 *			userCooldown: 5,
 *			globalCooldown: 0,
 *			usage: "",
 *			nsfw: false,
 *			allowDm: false,
 *			onlyDm: false,
 *		});
 *	}
 * };
 * module.exports = BanCommand;
 * ```
 *
 * @param name Command name - if unspecified, the filename is taken into consideration
 * @param description Command description
 * @param category Command category
 * @param aliases Array of alternative command names
 * @param usage Command usage
 * @param userPermissions Array of @see {@link https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable} Discord.JS' PermissionResolvables
 * @param userRoles Array of @see {@link https://discord.js.org/#/docs/main/stable/typedef/RoleResolvable} Discord.JS RoleResolvables
 * @param botPermissions Same as options.userPermissions, but affects the bot
 * @param botRoles Same as options.userRoles, but affects the bot
 * @param userCooldown Time, in seconds, which needs to elapse for another command to be used by a particular user
 * @param globalCooldown Time, in seconds, which needs to elapse for another command to be used on this guild
 * @param nsfw Whether this command should only be executable on channels which are marked as "NSFW" @see {@link https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=nsfw}
 * @param allowDm Whether this command can be executed in Direct Messages
 * @param onlyDm Whether this command is only executable in Direct Messages (if true, allowDm becomes true as well)
 * */
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
    guildCooldown?: Number;
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
    guildCooldown: Number;
    usage: string;
    nsfw: boolean;
    allowDm: boolean;
    onlyDm: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    disabled: boolean;
    /**
     * @param handler The command handler instance
     * @param filename Command name - if unspecified, the filename is taken into consideration
     * @param options Additional command options @see {@link CommandOptions}
     * */
    constructor(handler: CommandHandler, filename: string, options?: CommandOptions);
    /**
     * @param message The Discord.js message object
     * @param args The command arguments
     * @param additionalParams Parameters that were passed in runCommand()
     *
     * @override
     * */
    run(message: Message, args?: Array<String>, ...additionalParams: any): void;
}
export {};
