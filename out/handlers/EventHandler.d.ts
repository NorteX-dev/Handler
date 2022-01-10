/// <reference types="node" />
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { Event } from "../index";
interface HandlerOptions {
    client: Client;
    autoLoad?: boolean;
    directory?: string | undefined;
}
export declare class EventHandler extends EventEmitter {
    /**
     * Initializes a handler on the client.
     *
     * @param client Discord.JS Client Instance
     * @param eventsDir Event files directory
     * @returns EventHandler
     * */
    client: Client;
    directory?: string;
    events: Map<string, Event>;
    private localUtils;
    constructor(options: HandlerOptions);
    /**
     * Sets directory for commands
     *
     * @returns EventHandler
     *
     * @remarks
     * This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed.
     * @param absolutePath Absolute path to directory. Recommended to concatenate it using `path.join() and process.cwd()`
     * */
    setEventsDirectory(absolutePath: string): this;
    /**
     * Loads events into memory
     *
     * @returns EventHandler
     *
     * @remarks
     * Requires @see {@link EventHandler.setEventsDirectory} to be executed first, or `directory` to be specified in the constructor.
     *
     * @returns Map<string, Event>
     * */
    loadEvents(): Promise<unknown>;
}
export {};
