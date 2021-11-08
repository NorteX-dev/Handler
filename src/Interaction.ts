import MethodNotOverridenError from "./errors/MethodNotOverridenError";

import { ApplicationCommandOptionData, Client, CommandInteraction } from "discord.js";
import { CommandHandler } from "./CommandHandler";

interface InteractionOptions {
	name: string;
	description: string;
	type: string;
	options: ApplicationCommandOptionData;
	userIds?: Array<string>;
	guildIds?: Array<string>;
	disabled?: boolean;
	defaultPermission?: boolean;
}

export class Interaction {
	public handler: CommandHandler;
	public client: Client;
	public name: string;
	public type: string;
	public description: string | undefined;
	public options: ApplicationCommandOptionData;
	public userIds: Array<string>;
	public guildIds: Array<string>;
	public disabled: boolean;
	public defaultPermission: boolean;

	constructor(handler: CommandHandler, client: any, name: string, options?: InteractionOptions) {
		if (!options) options = <InteractionOptions>{};
		this.handler = handler;
		this.client = client;
		this.type = options.type?.toLowerCase() || "command";
		this.name = options.name || name;
		this.description = options.description;
		this.options = options.options;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;
		this.defaultPermission = options.defaultPermission || true;
		if (!["command", "usercontext", "rolecontext"].includes(this.type)) throw new Error("Bad type specified: " + this.type);
	}

	run(interaction: CommandInteraction) {
		throw new MethodNotOverridenError("run() method on " + this.name + " interaction is not present.");
	}
}
