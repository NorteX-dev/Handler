import { Client, Interaction as DJSInteraction } from "discord.js";
import Handler from "./Handler";
import Component from "../structures/Component";
interface HandlerOptions {
    client: Client;
    directory?: string;
    autoLoad?: boolean;
}
export default class ComponentHandler extends Handler {
    /**
     * Initializes an component interaction handler on the client.
     *
     * @param options Component handler options
     * @param options.client Discord.JS Client Instance
     * @param options.directory Optional - Component interaction files directory
     * @param options.autoLoad Optional - Automatically invoke the loadInteractions() method - requires `directory` to be set in the options
     * @returns ComponentHandler
     * */
    client: Client;
    directory?: string;
    owners?: Array<string>;
    components: Component[];
    constructor(options: HandlerOptions);
    /**
     * Loads component interactions into memory
     *
     * @returns ComponentHandler
     *
     * @remarks
     * Requires @see {@link InteractionHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * Run {@link ComponentHandler.runComponent()} to be invoked to run the ocmmand on an event.
     * */
    loadComponents(): Promise<unknown>;
    /**
     * Manually register an instanced component interaction. This should not be needed when using loadComponents().
     *
     * @returns Interaction
     * */
    registerComponent(component: Component): Component;
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<Component>
     *
     * */
    runComponent(interaction: DJSInteraction, ...additionalOptions: any): Promise<Component>;
    private handleComponent;
}
export {};
