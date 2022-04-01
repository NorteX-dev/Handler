import { Client, Interaction as DJSInteraction } from "discord.js";
import Handler from "./Handler";
import InteractionCommand from "../structures/InteractionCommand";
import UserContextMenu from "../structures/UserContextMenu";
import MessageContextMenu from "../structures/MessageContextMenu";
interface HandlerOptions {
    client: Client;
    directory?: string;
    autoLoad?: boolean;
    owners?: string[];
}
declare type InteractionRunnable = InteractionCommand | UserContextMenu | MessageContextMenu;
export default class InteractionHandler extends Handler {
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
     * const { InteractionHandler } = require("@nortex/handler");
     * const handler = new InteractionHandler({ client, directory: "./interactions" });
     * ```
     * */
    client: Client;
    interactions: InteractionRunnable[];
    directory?: string;
    owners?: Array<string>;
    constructor(options: HandlerOptions);
    /**
     * Loads interaction commands into memory
     *
     * @returns InteractionHandler
     *
     * @remarks
     * Requires @see {@link InteractionHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * {@link InteractionHandler.runInteraction} has to be run on the interactionCreate event to invoke the command run.
     * */
    loadInteractions(): Promise<unknown>;
    /**
     * Manually register an instanced interaction. This should not be needed when using loadInteractions().
     *
     * @returns Interaction
     * */
    registerInteraction(interaction: InteractionRunnable): InteractionRunnable;
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<Interaction>
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
    /**
     * Compare the local version of the interactions to the ones in Discord API and update if needed.
     *
     * @returns Interaction
     *
     * @param {boolean} [force=false] Skip checks and set commands even if the local version is up to date.
     * */
    updateInteractions(force?: boolean): Promise<boolean>;
    /**
     * @ignore
     * */
    private checkDiff;
}
export {};
