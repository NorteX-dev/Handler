/// <reference types="node" />
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { LocalUtils } from "../util/LocalUtils";
interface HandlerOptions {
    client: Client;
    directory?: string | undefined;
}
export declare class Handler extends EventEmitter {
    /**
     * Base class for handlers. Should not be used as-is. Use a subclass instead.
     *
     * @param client Discord.JS Client Instance
     * @param directory Command files directory
     * @returns Handler
     * */
    client: Client;
    directory?: string;
    localUtils: LocalUtils;
    constructor(options: HandlerOptions);
    /**
     * Sets directory for commands
     *
     * @remarks This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     *
     * @returns CommandHandler
     * @param value
     * */
    setDirectory(value: string): this;
    debug(message: string): void;
    loadAndInstance(emitReady?: boolean): Promise<any>;
}
export {};
