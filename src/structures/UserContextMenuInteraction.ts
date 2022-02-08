import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import { CommandHandler } from "../handlers/CommandHandler";

interface UserContextMenuInteractionOptions {
	name: string;
	disabled?: boolean;
	userIds?: Array<string>;
	guildIds?: Array<string>;
}

export class UserContextMenuInteraction {
	public handler: CommandHandler;
	public client: any;
	public type: string;
	public name: string;
	public disabled: boolean;
	public userIds: Array<string>;
	public guildIds: Array<string>;
	public opts?: any;

	constructor(handler: CommandHandler, client: any, name: string, options?: UserContextMenuInteractionOptions) {
		if (!options) options = <UserContextMenuInteractionOptions>{};
		this.handler = handler;
		this.client = client;
		this.type = "USER";
		this.name = options.name || name;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;

		this.opts = {}; // Initialize

		Object.keys(options).forEach((key) => {
			if (["name", "description", "options", "userIds", "guildIds", "disabled", "defaultPermission"].includes(key)) {
				return;
			}
			// @ts-ignore
			this.opts[key] = options[key];
		});
	}

	run(userContextMenuInteraction: any) {
		throw new MethodNotOverridenError("run() method on " + this.name + " interaction is not present.");
	}
}
