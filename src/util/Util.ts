import { Client } from "discord.js";
import CommandHandler from "../handlers/CommandHandler";
import EventHandler from "../handlers/EventHandler";
import InteractionHandler from "../handlers/InteractionHandler";
import ComponentHandler from "../handlers/ComponentHandler";

interface ManyClientsInterface {
	commands?: any;
	events?: any;
	interactions?: any;
	components?: any;
}

interface HandlersInterface {
	commandHandler?: CommandHandler;
	eventHandler?: EventHandler;
	interactionHandler?: InteractionHandler;
	componentHandler?: ComponentHandler;
}

export default class Util {
	private client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Util function for creating many handlers at once.
	 *
	 * @returns Object<string, AnyHandler>
	 *
	 * @param client The client instance to create handlers with.
	 * @param {ManyClientsInterface} options An object with the key as the handler names, and the values as the options (excl. the client option) being passed into their constructors.
	 *
	 * @example
	 * const handlers = Util.createMany(client, {
	 *  commands: {
	 *    directory: "./commands",
	 *    prefix: "!"
	 *  },
	 *  interactions: {
	 *    directory: "./interactions",
	 *    autoLoad: false,
	 *  }
	 * }
	 * */
	public static createMany(client: Client, options: ManyClientsInterface) {
		if (!client || !options) throw new Error("createMany(): Invalid client or directories.");
		let handlers: HandlersInterface = {
			commandHandler: undefined,
			eventHandler: undefined,
			interactionHandler: undefined,
			componentHandler: undefined,
		};
		const keys: string[] = Object.keys(options);
		for (let key of keys) {
			if (key === "commands") handlers.commandHandler = new CommandHandler({ client, ...options[key] });
			else if (key === "events") handlers.eventHandler = new EventHandler({ client, ...options[key] });
			else if (key === "interactions") handlers.interactionHandler = new InteractionHandler({ client, ...options[key] });
			else if (key === "components") handlers.componentHandler = new ComponentHandler({ client, ...options[key] });
			else
				throw new Error(
					`createMany(): Invalid key '${key}' inside 'options'. Valid keys are 'commands', 'events', 'interactions', and 'components'.`
				);
		}
		return handlers;
	}

	public static createMessageLink(guildId: string, channelId: string, messageId?: string) {
		if (!guildId || !channelId) throw new TypeError("createMessageLink(): missing required properties: 'guildId', 'channelId'.");
		if (messageId) return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
		return `https://discord.com/channels/${guildId}/${channelId}`;
	}
}
