import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import { InteractionHandler } from "../handlers/InteractionHandler";

interface MessageContextMenuInteractionOptions {
	name: string;
	disabled?: boolean;
	userIds?: Array<string>;
	guildIds?: Array<string>;
}

export class MessageContextMenu {
	public handler: InteractionHandler;
	public client: any;
	public type: string;
	public name: string;
	public disabled: boolean;
	public userIds: Array<string>;
	public guildIds: Array<string>;

	constructor(handler: InteractionHandler, client: any, filename: string, options?: MessageContextMenuInteractionOptions) {
		if (!options) options = <MessageContextMenuInteractionOptions>{};
		this.handler = handler;
		this.client = client;
		this.type = "MESSAGE";
		this.name = options.name || filename;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;
	}

	run(userContextMenuInteraction: any, ...additionalParams: any) {
		throw new MethodNotOverridenError("run() method on " + this.name + " interaction is not present.");
	}
}
