/// <reference types="node" />
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { Command } from "../structures/Command";
interface HandlerOptions {
    client: Client;
    autoLoad: boolean;
    directory: string | undefined;
    prefix: string;
    owners: Array<string>;
}
export declare class CommandHandler extends EventEmitter {
    /**
     * Initializes a handler on the client.
     *
     * @param client Discord.JS Client Instance
     * @param commandDir Command files directory
     * @returns CommandHandler
     * @example
     * ```js
     * const { CommandHandler } = require("@nortex-dev/handler");
     * const handler = new CommandHandler({ client: client });
     * ```
     * */
    client: Client;
    directory: string | undefined;
    commands: Map<string, Command>;
    aliases: Map<string, string>;
    prefix: string;
    owners: Array<string>;
    private readonly userCooldowns;
    private readonly guildCooldowns;
    private localUtils;
    constructor(options: HandlerOptions);
    /**
     * Sets directory for commands
     *
     * @returns CommandHandler
     *
     * @remarks
     * This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     * @param absolutePath Absolute path to directory. Recommended to concatenate it using `path.join() and process.cwd()`
     *
     * @returns CommandHandler
     * */
    setCommandDirectory(absolutePath: string): this;
    /**
     * Loads classic message commands into memory
     *
     * @returns CommandHandler
     *
     * @remarks
     * Requires @see {@link CommandHandler.setCommandDirectory} to be executed first, or `directory` to be specified in the constructor.
     *
     * @returns Map<string, Command>
     * */
    loadCommands(): Promise<unknown>;
    registerCommand(command: Command, filename?: string): void;
    /**
     * @ignore
     * */
    private setupMessageEvent;
}
export {};
