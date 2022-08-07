import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import CommandsHandler from "../handlers/CommandsHandler";

interface IContextMenuInteractionOptions {
	name: string;
	type: "MESSAGE" | "USER";
	disabled?: boolean;
	userIds?: Array<string>;
	guildIds?: Array<string>;
	defaultPermissions?: Array<string>;
}

export default class ContextMenu {
	public handler: CommandsHandler;
	public client: any;
	public type: "MESSAGE" | "USER";
	public name: string;
	public disabled: boolean;
	public userIds: Array<string>;
	public guildIds: Array<string>;
	public defaultPermissions?: Array<string>;

	constructor(handler: CommandsHandler, filename: string, options?: IContextMenuInteractionOptions) {
		if (!options) options = <IContextMenuInteractionOptions>{};
		if (!options.name || !options.type) throw new Error(`Failed to load ${filename}: name and type are required.`);
		this.handler = handler;
		this.client = handler.client;
		this.type = options.type;
		this.name = options.name || filename;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;
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
