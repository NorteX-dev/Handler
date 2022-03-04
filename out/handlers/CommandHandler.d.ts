import { Client, Message } from "discord.js";
import { Handler } from "./Handler";
import { Command } from "../structures/Command";
interface HandlerOptions {
    client: Client;
    autoLoad: boolean;
    directory?: string;
    prefix?: string;
    owners?: Array<string>;
}
export declare class CommandHandler extends Handler {
    /**
     * Initializes a handler on the client.
     *
     * @param client Discord.JS Client Instance
     * @param directory Command files directory
     * @param prefix Command prefix
     * @param owners Array of owners
     * @param autoLoad If undefined or true, will auto load commands; explicitely specify "false" to not load commands automatically
     * @returns CommandHandler
     * @example
     * ```js
     * const { CommandHandler } = require("@nortex-dev/handler");\
     * const handler = new CommandHandler({ client: client });
     * ```
     * */
    commands: Map<string, Command>;
    aliases: Map<string, string>;
    prefix?: string[];
    owners: string[];
    private readonly userCooldowns;
    private readonly guildCooldowns;
    private localUtils;
    constructor(options: HandlerOptions);
    /**
     * Sets a prefix
     *
     * @param prefix Prefix to set
     *
     * @returns CommandHandler
     * */
    setPrefix(prefix: string | string[]): this;
    /**
     * Loads classic message commands into memory
     *
     * @returns CommandHandlers
     *
     * @remarks
     * Requires @see {@link CommandHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     *
     * @returns Map<string, Command>
     * */
    loadCommands(): Promise<unknown>;
    /**
     * Manually register an instanced command. This should not be needed when using loadCommands().
     *
     * @returns Command
     *
     * @returns Map<string, Command>
     * */
    registerCommand(command: Command): Command;
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<<Command>
     * */
    runCommand(message: Message, ...additionalOptions: any): Promise<Command>;
}
export {};
