import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import { CommandHandler } from "../handlers/CommandHandler";

interface ComponentInteractionOptions {
	customId: string;
}

export class ComponentInteraction {
	public handler: CommandHandler;
	public client: any;
	public type: string;
	public customId: string;
	public name: string;

	constructor(handler: CommandHandler, client: any, name: string, options?: ComponentInteractionOptions) {
		if (!options) options = <ComponentInteractionOptions>{};
		this.handler = handler;
		this.client = client;
		this.type = "COMPONENT";
		this.customId = options.customId;
		// this.customId = typeof options.customId === "string" ? new RegExp(options.customId) : options.customId;
		this.name = this.customId;
		if (!this.customId) throw new Error("ComponentInteraction: customId is required.");
	}

	/*z
	 * @param {Interaction} interaction
	 * @override
	 * */
	run(interaction: any, ...additionalParams: any) {
		throw new MethodNotOverridenError("run() method on " + this.customId + " interaction is not present.");
	}
}
