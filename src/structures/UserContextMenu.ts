import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import InteractionHandler from "../handlers/InteractionHandler";

interface UserContextMenuInteractionOptions {
	name: string;
	disabled?: boolean;
	userIds?: Array<string>;
	guildIds?: Array<string>;
}

export default class UserContextMenu {
	public handler: InteractionHandler;
	public client: any;
	public type: string;
	public name: string;
	public disabled: boolean;
	public userIds: Array<string>;
	public guildIds: Array<string>;

	constructor(handler: InteractionHandler, filename: string, options?: UserContextMenuInteractionOptions) {
		if (!options) options = <UserContextMenuInteractionOptions>{};
		this.handler = handler;
		this.client = handler.client;
		this.type = "USER";
		this.name = options.name || filename;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;
	}

	/**
	 * @param interaction The Discord.js interaction object
	 * @param additionalParams Parameters that were passed in runInteraction()
	 *
	 * @override
	 * */
	run(interaction: any, additionalParams?: any) {
		throw new MethodNotOverridenError("run() method on " + this.name + " interaction is not present.");
	}
}
