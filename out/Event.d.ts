import { Client } from "discord.js";
import { EventHandler } from "./EventHandler";
interface EventOptions {
    name: string;
    once?: boolean;
}
export declare class Event {
    handler: EventHandler;
    client: Client;
    name: string;
    once: boolean;
    constructor(handler: EventHandler, client: Client, name: string, options?: EventOptions);
    run(...args: Array<any>): void;
}
export {};
