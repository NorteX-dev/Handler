import CommandsHandler from "../handlers/CommandsHandler";
import MethodNotOverridenError from "../errors/MethodNotOverridenError";

interface ApplicationCommandOptions {
	name: string;
	description: string;
	category?: string;
	options: any[];
	userIds?: Array<string>;
	guildIds?: Array<string>;
	disabled?: boolean;
	defaultPermissions?: Array<string>;
}

export default class Command {
	public handler: CommandsHandler;
	public client: any;
	public type: string;
	public name: string;
	public description: string;
	public category: string | undefined;
	public options: any[];
	public userIds: Array<string>;
	public guildIds: Array<string>;
	public disabled: boolean;
	public defaultPermissions?: Array<string>;

	constructor(handler: CommandsHandler, filename: string, options?: ApplicationCommandOptions) {
		if (!options) options = <ApplicationCommandOptions>{};
		this.handler = handler;
		this.client = handler.client;
		this.type = "CHAT_INPUT";
		this.name = options.name || filename;
		this.description = options.description;
		this.category = options.category;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;

		// Exclusive properties for slash commands
		this.options = options.options;
		this.defaultPermissions = options.defaultPermissions;
	}

	/**
	 * @param interaction The Discord.js interaction object
	 * @param additionalParams Parameters that were passed in runInteraction()
	 *
	 * @override
	 * */
	run(interaction: any, additionalParams?: any) {
		throw new MethodNotOverridenError(`run() method on ${this.name} interaction is not present.`);
	}
}
