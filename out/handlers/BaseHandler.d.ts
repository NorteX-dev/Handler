import { Client } from "discord.js";
import { EventEmitter } from "events";
interface HandlerOptions {
    client: Client;
    directory?: string | undefined;
}
export declare class BaseHandler extends EventEmitter {
    client: Client;
    directory?: string;
    private files;
    constructor(options: HandlerOptions);
    setDirectory(value: string): this;
    debug(message: string): void;
    load(emitReady?: boolean): Promise<any>;
    loadAndPopulateFiles(directory: string): void;
}
export {};
