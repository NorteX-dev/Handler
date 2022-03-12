import { EventHandler } from "../index";
interface EventOptions {
    name: string;
    once?: boolean;
}
export declare class Event {
    handler: EventHandler;
    client: any;
    name: string;
    once: boolean;
    constructor(handler: EventHandler, filename: string, options?: EventOptions);
    run(args?: Array<any>): void;
}
export {};
