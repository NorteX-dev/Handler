/// <reference types="node" />
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { Event } from "./index";
interface HandlerOptions {
    client: Client;
    autoLoad?: boolean;
    directory?: string | undefined;
}
export declare class EventHandler extends EventEmitter {
    client: Client;
    directory?: string;
    events: Map<string, Event>;
    private localUtils;
    constructor(options: HandlerOptions);
    setEventsDirectory(absolutePath: string): this;
    loadEvents(): Promise<unknown>;
}
export {};