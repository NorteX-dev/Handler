import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import { CommandHandler } from "../handlers/CommandHandler";

interface ComponentInteractionOptions {
	customId: string;
	queryingMode: "exact" | "includes" | "startsWith";
}

export class ComponentInteraction {
	public handler: CommandHandler;
	public client: any;
	public type: string;
	public customId: string;
	public name: string;
	public queryingMode: string;

	constructor(handler: CommandHandler, filename: string, options?: ComponentInteractionOptions) {
		if (!options) options = <ComponentInteractionOptions>{};
		if (!options.customId) throw new Error(`ComponentInteraction (${filename}): customId is required.`);
		if (!options.queryingMode) options.queryingMode = "exact";
		if (!["exact", "includes", "startsWith"].includes(options.queryingMode))
			throw new Error(filename + ": Invalid querying mode for component interaction. Querying mode must be one of: exact, includes, startsWith.");
		this.handler = handler;
		this.client = handler.client;
		this.type = "COMPONENT";
		this.customId = options.customId;
		this.name = this.customId;
		this.queryingMode = options.queryingMode || "exact";
	}

	/*z
	 * @param {Interaction} interaction
	 * @override
	 * */
	run(interaction: any, ...additionalParams: any) {
		throw new MethodNotOverridenError("run() method on " + this.customId + " interaction is not present.");
	}
}
