import { Client } from "discord.js";
import MessageCommandHandler from "../handlers/MessageCommandHandler";
import EventHandler from "../handlers/EventHandler";
import CommandsHandler from "../handlers/CommandsHandler";
import ComponentHandler from "../handlers/ComponentHandler";
interface ManyClientsInterface {
    commands?: any;
    events?: any;
    interactions?: any;
    components?: any;
}
interface HandlersInterface {
    commandHandler?: MessageCommandHandler;
    eventHandler?: EventHandler;
    interactionHandler?: CommandsHandler;
    componentHandler?: ComponentHandler;
}
export default class Util {
    private client;
    constructor(client: Client);
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
    static createMany(client: Client, options: ManyClientsInterface): HandlersInterface;
    static createMessageLink(guildId: string, channelId: string, messageId?: string): string;
}
export {};
