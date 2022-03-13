import { Client } from "discord.js";
import Event from "../structures/Event";
import Handler from "./Handler";
interface HandlerOptions {
    client: Client;
    autoLoad?: boolean;
    directory?: string | undefined;
}
export default class EventHandler extends Handler {
    /**
     * Initializes an event handler on the client.
     *
     * @returns EventHandler
     * @param options The options to initialize the handler with.
     * @param options.client The client to initialize the handler with.
     * @param options.autoLoad Whether or not to automatically load the events.
     * @param options.directory The directory to load the events from.
     * */
    constructor(options: HandlerOptions);
    /**
     * Loads events & creates the event emitter handlers.
     *
     * @returns Promise<EventHandler>
     *
     * @remarks
     * Requires @see {@link EventHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * */
    loadEvents(): Promise<EventHandler>;
    /**
     * Manually register an instanced event. This should not be needed when using loadEvents().
     *
     * @returns Command
     * */
    registerEvent(event: Event): Event;
}
export {};
