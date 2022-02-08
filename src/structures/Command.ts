import MethodNotOverridenError from "../errors/MethodNotOverridenError";

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

export class Command {
	public handler: CommandHandler;
	public client: any;
	public name: string;
	public description?: string | undefined;
	public category: string;
	public aliases: Array<string>;
	public userPermissions: Array<string>;
	public userRoles: Array<string>;
	public botPermissions: Array<string>;
	public botRoles: Array<string>;
	public userCooldown: Number;
	public guildCooldown: Number;
	public usage: string;
	public nsfw: boolean;
	public allowDm: boolean;
	public onlyDm: boolean;
	public userIds: Array<string>;
	public guildIds: Array<string>;
	public disabled: boolean;

	public opts?: any;

	/**
	 * @param handler The command handler instance
	 * @param client The Discord.js client instance
	 * @param name Command name - if unspecified, the filename is taken into consideration
	 * @param options Additional command options @see {@link CommandOptions}
	 * */
	constructor(handler: CommandHandler, client: any, name: string, options?: CommandOptions) {
		if (!options) options = <CommandOptions>{};
		this.handler = handler;
		this.client = client;
		this.name = options.name || name;
		this.description = options.description || "";
		this.category = options.category || "Miscellaneous";
		this.aliases = options.aliases || [];
		this.usage = options.usage || "";
		this.userPermissions = options.userPermissions || [];
		this.userRoles = options.userRoles || [];
		this.botPermissions = options.botPermissions || [];
		this.botRoles = options.botRoles || [];
		this.userCooldown = options.userCooldown || 0;
		this.guildCooldown = options.guildCooldown || 0;
		this.nsfw = options.nsfw || false;
		this.allowDm = options.allowDm || false;
		this.onlyDm = options.onlyDm || false;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;

		this.opts = {}; // Initialize

		Object.keys(options).forEach((key) => {
			if (
				[
					"name",
					"description",
					"category",
					"aliases",
					"userPermissions",
					"userRoles",
					"botPermissions",
					"botRoles",
					"userCooldown",
					"guildCooldown",
					"usage",
					"nsfw",
					"allowDm",
					"onlyDm",
					"userIds",
					"guildIds",
					"disabled",
				].includes(key)
			) {
				return;
			}
			// @ts-ignore
			this.opts[key] = options[key];
		});

		if (this.onlyDm && !this.allowDm) this.allowDm = true;
	}

	/**
	 * @param message The Discord.js message object
	 * @param args The command arguments
	 * @param additionalParams Parameters that were passed in runCommand()
	 *
	 * @override
	 * */
	run(message: Message, args?: Array<String>, ...additionalParams: any) {
		throw new MethodNotOverridenError("run() method on " + this.name + " command is not present.");
	}
}
