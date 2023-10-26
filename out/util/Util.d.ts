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
    private client;
    constructor(client: Client);
    static createMany(client: Client, options: ManyClientsInterface): HandlersInterface;
    static createMessageLink(guildId: string, channelId: string, messageId?: string): string;
}
export {};
