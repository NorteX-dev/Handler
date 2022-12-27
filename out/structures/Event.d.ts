import { EventHandler } from "../handlers/EventHandler";
export declare class Event {
    handler: EventHandler | undefined;
    client: any;
    name: string | undefined;
    once: boolean | undefined;
    run(args?: any): void;
}
