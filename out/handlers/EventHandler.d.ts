import { Event } from "../structures/Event";
import { BaseHandler } from "./BaseHandler";
interface HandlerOptions {
    client: any;
    autoLoad?: boolean;
    directory?: string | undefined;
}
export declare class EventHandler extends BaseHandler {
    constructor(options: HandlerOptions);
    loadEvents(): Promise<EventHandler>;
    registerEvent(event: Event): void;
}
export {};
