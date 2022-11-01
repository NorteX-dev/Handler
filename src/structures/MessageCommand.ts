import MethodNotOverridenError from "../errors/MethodNotOverridenError";
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
	public handler: MessageCommandHandler;
	public client: any;
	public name: string;
	public description?: string | undefined;
	public category: string;
	public aliases: string[];
	public userPermissions: string[];
	public userRoles: string[];
	public botPermissions: string[];
	public botRoles: Array<string>;
	public userCooldown: number;
	public guildCooldown: number;
	public usage: string;
	public nsfw: boolean;
	public allowDm: boolean;
	public onlyDm: boolean;
	public userIds: string[];
	public guildIds: string[];
	public disabled: boolean;

	/**
	 * @param handler The command handler instance
	 * @param filename MessageCommand name - if unspecified, the filename is taken into consideration
	 * @param options Additional command options @see {@link CommandOptions}
	 * */
	constructor(handler: MessageCommandHandler, filename: string, options?: CommandOptions) {
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
		if (this.onlyDm && !this.allowDm) this.allowDm = true;
	}

	/**
	 * @param message The Discord.js message object
	 * @param args The command arguments
	 * @param additionalParams Parameters that were passed in runCommand()
	 *
	 * @override
	 * */
	run(message: any, args?: Array<String>, additionalParams?: any) {
		throw new MethodNotOverridenError(`run() method on ${this.name} command is not present.`);
	}
}
