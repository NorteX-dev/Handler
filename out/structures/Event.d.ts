import { EventHandler } from "../handlers/EventHandler";
import { Client } from "discord.js";
export declare class Event {
    handler: EventHandler | undefined;
    client: Client | undefined;
    name: string | undefined;
    once: boolean | undefined;
    run(args?: any): void;
}
