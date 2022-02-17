import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import { ApplicationCommandOptionData } from "discord.js";
import { CommandHandler } from "../handlers/CommandHandler";

interface CommandInteractionOptions {
	name: string;
	description: string;
	options: ApplicationCommandOptionData;
	userIds?: Array<string>;
	guildIds?: Array<string>;
	disabled?: boolean;
	defaultPermission?: boolean;
}

export class CommandInteraction {
	public handler: CommandHandler;
	public client: any;
	public name: string;
	public type: string;
	public description: string | undefined;
	public options: ApplicationCommandOptionData;
	public userIds: Array<string>;
	public guildIds: Array<string>;
	public disabled: boolean;
	public defaultPermission: boolean;

	constructor(handler: CommandHandler, client: any, name: string, options?: CommandInteractionOptions) {
		if (!options) options = <CommandInteractionOptions>{};
		this.handler = handler;
		this.client = client;
		this.type = "CHAT_INPUT";
		this.name = options.name || name;
		this.description = options.description;
		this.options = options.options;
		this.userIds = options.userIds || [];
		this.guildIds = options.guildIds || [];
		this.disabled = options.disabled || false;
		this.defaultPermission = options.defaultPermission || true;
		if (!this.description) throw new Error("CommandInteraction: description is required.");
	}

	/*z
	 * @param {Interaction} interaction
	 * @override
	 * */

	run(interaction: any, ...additionalParams: any) {
		throw new MethodNotOverridenError("run() method on " + this.name + " interaction is not present.");
	}
}
