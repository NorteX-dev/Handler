import EventHandler from "../handlers/EventHandler";
interface EventOptions {
    name: string;
    once?: boolean;
}
export default class Event {
    handler: EventHandler;
    client: any;
    name: string;
    once: boolean;
    constructor(handler: EventHandler, filename: string, options?: EventOptions);
    run(args?: any): void;
}
export {};
