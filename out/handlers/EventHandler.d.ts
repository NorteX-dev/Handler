import { Client } from "discord.js";
import { Event } from "../index";
import { Handler } from "./Handler";
interface HandlerOptions {
    client: Client;
    autoLoad?: boolean;
    directory?: string | undefined;
}
export declare class EventHandler extends Handler {
    /**
     * Initializes an event handler on the client.
     *
     * @param client Discord.JS Client Instance
     * @param directory Event files directory
     * @returns EventHandler
     * */
    events: Map<string, Event>;
    constructor(options: HandlerOptions);
    /**
     * Loads events & creates the event emitter handlers.
     *
     * @returns EventHandler
     *
     * @remarks
     * Requires @see {@link EventHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     *
     * @returns Map<string, Event>
     * */
    loadEvents(): Promise<unknown>;
}
export {};
