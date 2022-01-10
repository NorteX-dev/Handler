/// <reference types="node" />
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { CommandInteraction, MessageContextMenuInteraction, UserContextMenuInteraction } from "../index";
interface HandlerOptions {
    client: Client;
    autoLoad?: boolean;
    directory?: string | undefined;
    disableInteractionModification?: boolean;
    owners?: Array<string>;
    forceInteractionUpdate?: boolean;
}
export declare class InteractionHandler extends EventEmitter {
    /**
     * Initializes an interaction handler on the client.
     *
     * @param options Interaction handler options
     * @param options.client Discord.JS Client Instance
     * @param options.directory Optional - Interaction files directory
     * @param options.owners Optional - Array of superusers' ids
     * @param options.disableInteractionModification Optional - Forcibly stop any modification of application commands
     * @param options.forceInteractionUpdate Optional - Forcibly update command applications every load - this option can get you rate limited if the bot restarts often
     * @param options.autoLoad Optional - Automatically invoke the loadInteractions() method - requires `directory` to be set in the options
     * @returns InteractionHandler
     * @example
     * ```js
     * const { InteractionHandler } = require("@nortex-dev/handler");
     * const handler = new InteractionHandler({ client: client });
     * ```
     * */
    client: Client;
    directory?: string;
    owners?: Array<string>;
    disableInteractionModification?: boolean;
    forceInteractionUpdate?: boolean;
    private application;
    interactions: Map<string, CommandInteraction | UserContextMenuInteraction | MessageContextMenuInteraction>;
    private localUtils;
    constructor(options: HandlerOptions);
    /**
     * Sets directory for interactions
     *
     * @returns InteractionHandler
     *
     * @remarks
     * This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     * @param absolutePath Absolute path to directory. Recommended to concatenate it using `path.join() and process.cwd()`
     * */
    setInteractionsDirectory(absolutePath: string): this;
    /**
     * Loads interaction commands into memory
     *
     * @returns InteractionHandler
     *
     * @remarks
     * Requires @see {@link InteractionHandler.setInteractionsDirectory} to be executed first, or `directory` to be specified in the constructor.
     * */
    loadInteractions(): Promise<unknown>;
    /**
     * @ignore
     * */
    private setupInteractionEvent;
    private handleCommandInteraction;
    /**
     * @ignore
     * */
    private handleContextMenuInteraction;
    /**
     * @ignore
     * */
    private postInteractions;
    /**
     * @ignore
     * */
    private didChange;
}
export {};
