import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import { Message } from "discord.js";
import CommandHandler from "../handlers/CommandHandler";

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
	parameters?: Array<Parameter>;
}

/**
 * Configuration object for {@link Parameter.prompt}.
 *
 * @interface PromptConfig
 * @param message A string content value or a function that returns a Message instance (value returned from message.channel.send)
 * @param timeout The amount of time, in milliseconds, when the prompt is going to expire.
 * @param onTimeout Callback function which is ran when the prompt has not received any response in the time specified.
 * */

interface PromptConfig {
	message: string | Function; // A content string or a method that returns type Message
	timeout?: number;
	onTimeout?: Function;
}

/**
 * Useful for automatically populating args with the correct type and if needed, non-null values, with prompt support.
 *
 * @interface Parameter
 * @param name Parameter name
 * @param required If true and parameters are missing from the command, the command will not execute and onMissing() is executed
 * @param prompt Prompt configuration, refer to @see {@link PromptConfig}
 * @param description Parameter description
 * @param validator A function with a boolean return type which evaluates whether a specified value is valid (for example checking whether the value is a number or whether it is a valid user).
 * @param transform A function that transforms the value (for example user fetching or parsing numbers etc.) before it is added back to args.
 * @param onMissing A function ran when this parameter is missing. Remember this will also fired if prompting is enabled.
 * @param onInvalid A function ran when this parameter is invalid (fails validator), whether it's from the original command or a prompt response.
 * */
interface Parameter {
	name: string;
	required?: boolean;
	description?: string; // Not used anywhere in the handler, but readable
	prompt?: PromptConfig;
	validator?: Function;
	transform?: Function;
	onMissing?: Function;
	onInvalid?: Function; // you might reprompt with parameter.prompt(config)
}

export default class Command {
	public handler: CommandHandler;
	public client: any;
	public name: string;
	public description?: string | undefined;
	public category: string;
	public aliases: string[];
	public userPermissions: string[];
	public userRoles: string[];
	public botPermissions: string[];
	public botRoles: Array<string>;
	public userCooldown: Number;
	public guildCooldown: Number;
	public usage: string;
	public nsfw: boolean;
	public allowDm: boolean;
	public onlyDm: boolean;
	public userIds: string[];
	public guildIds: string[];
	public disabled: boolean;
	public parameters: Parameter[];

	/**
	 * @param handler The command handler instance
	 * @param filename Command name - if unspecified, the filename is taken into consideration
	 * @param options Additional command options @see {@link CommandOptions}
	 * */
	constructor(handler: CommandHandler, filename: string, options?: CommandOptions) {
		if (!options) options = <CommandOptions>{};
		this.handler = handler;
		this.client = handler.client;
		this.name = options.name || filename;
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
		this.parameters = options.parameters || [];
		if (this.onlyDm && !this.allowDm) this.allowDm = true;
	}

	/**
	 * @param message The Discord.js message object
	 * @param args The command arguments
	 * @param additionalParams Parameters that were passed in runCommand()
	 *
	 * @override
	 * */
	run(message: Message, args?: Array<String>, additionalParams?: any) {
		throw new MethodNotOverridenError("run() method on " + this.name + " command is not present.");
	}
}
