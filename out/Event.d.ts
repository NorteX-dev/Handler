import { EventHandler } from "./EventHandler";
interface EventOptions {
    name: string;
    once?: boolean;
}
export declare class Event {
    handler: EventHandler;
    client: any;
    name: string;
    once: boolean;
    constructor(handler: EventHandler, client: any, name: string, options?: EventOptions);
    run(...args: Array<any>): void;
}
export {};
