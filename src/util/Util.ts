import { Client } from "discord.js";
import { EventHandler } from "../handlers/EventHandler";
import { CommandHandler } from "../handlers/CommandHandler";
import { ComponentHandler } from "../handlers/ComponentHandler";

interface ManyClientsInterface {
	commands?: any;
	events?: any;
	components?: any;
}

interface HandlersInterface {
	commandHandler?: CommandHandler;
	eventHandler?: EventHandler;
	componentHandler?: ComponentHandler;
}

export default class Util {
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	public static createMany(client: Client, options: ManyClientsInterface) {
		if (!client || !options) throw new Error("createMany(): Invalid client or directories.");
		let handlers: HandlersInterface = {
			commandHandler: undefined,
			eventHandler: undefined,
			componentHandler: undefined,
		};
		for (let [key, value] of Object.entries(options)) {
			if (key === "events") handlers.eventHandler = new EventHandler({ client, ...value });
			else if (key === "commands") handlers.commandHandler = new CommandHandler({ client, ...value });
			else if (key === "components") handlers.componentHandler = new ComponentHandler({ client, ...value });
			else throw new Error(`createMany(): Invalid key '${key}' inside 'options'. Valid keys are 'commands', 'events' and 'components'.`);
		}
		return handlers;
	}

	public static createMessageLink(guildId: string, channelId: string, messageId?: string) {
		if (!guildId || !channelId) throw new TypeError("createMessageLink(): missing required properties: 'guildId', 'channelId'.");
		if (messageId) return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
		return `https://discord.com/channels/${guildId}/${channelId}`;
	}
}
