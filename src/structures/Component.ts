import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import ComponentHandler from "../handlers/ComponentHandler";
import { Client, Interaction } from "discord.js";

interface ComponentOptions {
	customId: string;
	queryingMode: "exact" | "includes" | "startsWith";
}

export default class Component {
	public handler: ComponentHandler;
	public client: Client;
	public type: string;
	public customId: string;
	public queryingMode: string;

	constructor(handler: ComponentHandler, filename: string, options?: ComponentOptions) {
		if (!options) options = <ComponentOptions>{};
		if (!options.customId) throw new Error(`Component (${filename}): customId is required.`);
		if (!options.queryingMode) options.queryingMode = "exact";
		this.handler = handler;
		this.client = handler.client;
		this.queryingMode = options.queryingMode || "exact";
		this.type = "COMPONENT";
		this.customId = options.customId;
		if (!["exact", "includes", "startsWith"].includes(options.queryingMode))
			throw new Error(
				filename + ": Invalid querying mode for component interaction. Querying mode must be one of: exact, includes, startsWith."
			);
	}

	/**
	 * @param interaction The Discord.js interaction object
	 * @param additionalParams Parameters that were passed in runInteraction()
	 *
	 * @override
	 * */
	run(interaction: Interaction, ...additionalParams: any) {
		throw new MethodNotOverridenError("run() method on " + this.customId + " interaction is not present.");
	}
}
