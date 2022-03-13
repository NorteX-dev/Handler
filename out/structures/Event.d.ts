import EventHandler from "../handlers/EventHandler";
interface EventOptions {
    name: string;
    once?: boolean;
    ws?: boolean;
}
export default class Event {
    handler: EventHandler;
    client: any;
    name: string;
    once: boolean;
    ws: boolean;
    constructor(handler: EventHandler, filename: string, options?: EventOptions);
    run(args?: Array<any>): void;
}
export {};
