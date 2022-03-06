import { Client, Interaction as DJSInteraction } from "discord.js";
import { Handler } from "./Handler";
import { InteractionCommand, MessageContextMenu, UserContextMenu } from "../index";
interface HandlerOptions {
    client: Client;
    directory?: string;
    autoLoad?: boolean;
    owners?: Array<string>;
}
export declare class InteractionHandler extends Handler {
    /**
     * Initializes an interaction handler on the client.
     *
     * @param options Interaction handler options
     * @param options.client Discord.JS Client Instance
     * @param options.directory Optional - Interaction files directory
     * @param options.owners Optional - Array of superusers' ids
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
    private application;
    interactions: Map<string, InteractionCommand | UserContextMenu | MessageContextMenu>;
    constructor(options: HandlerOptions);
    /**
     * Loads interaction commands into memory
     *
     * @returns InteractionHandler
     *
     * @remarks
     * Requires @see {@link InteractionHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * Run {@link InteractionHandler.runInteraction()} to be invoked to run the ocmmand on an event.
     * */
    loadInteractions(): Promise<unknown>;
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<Interaction>
     *
     * */
    runInteraction(interaction: DJSInteraction, ...additionalOptions: any): Promise<unknown>;
    /**
     * @ignore
     * */
    private handleCommandInteraction;
    /**
     * @ignore
     * */
    private handleContextMenuInteraction;
    updateInteractions(force?: boolean): Promise<void>;
    /**
     * @ignore
     * */
    private checkDiff;
}
export {};
