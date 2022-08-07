import { Client } from "discord.js";
import { EventEmitter } from "events";
interface HandlerOptions {
    client: Client;
    directory?: string | undefined;
}
export default class BaseHandler extends EventEmitter {
    /**
     * Base class for handlers. Should not be used as-is. Use a subclass instead.
     *
     * @param client Discord.JS Client Instance
     * @param directory MessageCommand files directory
     * @returns BaseHandler
     * */
    client: Client;
    directory?: string;
    constructor(options: HandlerOptions);
    /**
     * Sets (absolute) directory for commands
     *
     * @remarks This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     *
     * @returns CommandHandler
     * @param value
     * */
    setDirectory(value: string): this;
    debug(message: string): void;
    load(emitReady?: boolean): Promise<any>;
}
export {};
