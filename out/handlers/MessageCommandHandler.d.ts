import { Client, Message } from "discord.js";
import BaseHandler from "./BaseHandler";
import MessageCommand from "../structures/MessageCommand";
interface HandlerOptions {
    client: Client;
    autoLoad?: boolean;
    directory?: string;
    prefix?: string;
    owners?: Array<string>;
}
export default class MessageCommandHandler extends BaseHandler {
    /**
     * Initializes a handler on the client.
     *
     * @param client Discord.JS Client Instance
     * @param directory MessageCommand files directory
     * @param prefix MessageCommand prefix
     * @param owners Array of owners
     * @param autoLoad If undefined or true, will auto load commands; explicitely specify "false" to not load commands automatically
     * @returns MessageCommandHandler
     * @example
     * ```js
     * const { MessageCommandHandler } = require("@nortex-dev/handler");\
     * const handler = new MessageCommandHandler({ client: client });
     * ```
     * */
    commands: MessageCommand[];
    aliases: Map<string, string>;
    prefix?: string[];
    owners: string[];
    private readonly userCooldowns;
    private readonly guildCooldowns;
    constructor(options: HandlerOptions);
    /**
     * Sets a prefix
     *
     * @param prefix Prefix to set
     *
     * @returns MessageCommandHandler
     * */
    setPrefix(prefix: string | string[]): this;
    /**
     * Loads classic message commands into memory
     *
     * @returns MessageCommand[]
     *
     * @remarks
     * Requires @see {@link MessageCommandHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * */
    loadCommands(): Promise<MessageCommand[]>;
    /**
     * Manually register an instanced command. This should not be needed when using loadCommands().
     *
     * @returns MessageCommand
     * */
    registerCommand(command: MessageCommand): MessageCommand;
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<MessageCommand>
     * */
    runCommand(message: Message, ...additionalOptions: any): Promise<MessageCommand>;
}
export {};
