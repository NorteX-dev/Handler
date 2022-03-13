import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import { ApplicationCommandOptionData } from "discord.js";
import InteractionHandler from "../handlers/InteractionHandler";

interface ApplicationCommandOptions {
	name: string;
	description: string;
	options: ApplicationCommandOptionData;
	userIds?: Array<string>;
	guildIds?: Array<string>;
	disabled?: boolean;
	defaultPermission?: boolean;
	permissions: any[];
}

export default class InteractionCommand {
	public handler: InteractionHandler;
	public client: any;
	public type: string;
	public name: string;
	public description: string;
	public options: ApplicationCommandOptionData;
	public userIds: Array<string>;
	public guildIds: Array<string>;
	public disabled: boolean;
	public defaultPermission: boolean;
	public permissions: any[];

	constructor(handler: InteractionHandler, filename: string, options?: ApplicationCommandOptions) {
		if (!options) options = <ApplicationCommandOptions>{};
		if (!options.name || !options.description) throw new Error("CommandInteraction: name & description are required.");
		this.handler = handler;
		this.client = handler.client;
		this.type = "CHAT_INPUT";
		this.name = options.name || filename;
		this.description = options.description;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;

		// Exclusive properties for slash commands
		this.options = options.options;
		this.defaultPermission = options.defaultPermission || true;
		this.permissions = options.permissions || [];
	}

	run(interaction: any, ...additionalParams: any) {
		throw new MethodNotOverridenError("run() method on " + this.name + " interaction is not present.");
	}
}
