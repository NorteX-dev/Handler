/// <reference types="node" />
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { Interaction } from "./index";
interface HandlerOptions {
    client: Client;
    autoLoad?: boolean;
    directory?: string | undefined;
    disableInteractionModification?: boolean;
    debug?: boolean;
    owners?: Array<string>;
    forceInteractionUpdate?: boolean;
}
export declare class InteractionHandler extends EventEmitter {
    client: Client;
    directory?: string;
    owners?: Array<string>;
    disableInteractionModification?: boolean;
    forceInteractionUpdate?: boolean;
    interactions: Map<string, Interaction>;
    private localUtils;
    private readonly enableDebug;
    constructor(options: HandlerOptions);
    setInteractionsDirectory(absolutePath: string): this;
    loadInteractions(): Promise<unknown>;
    private setupInteractionEvent;
    private postInteractions;
    private whatChanged;
    private convertType;
}
export {};
