/// <reference types="node" />
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { Command } from "./Command";
interface HandlerOptions {
    client: Client;
    directory: string | undefined;
    debug: boolean;
    prefix: string;
    owners: Array<string>;
    autoLoad: boolean;
}
export declare class CommandHandler extends EventEmitter {
    client: Client;
    directory: string | undefined;
    commands: Map<string, Command>;
    aliases: Map<string, string>;
    prefix: string;
    owners: Array<string>;
    private readonly userCooldowns;
    private readonly guildCooldowns;
    private localUtils;
    private readonly enableDebug;
    constructor(options: HandlerOptions);
    setCommandDirectory(absolutePath: string): this;
    loadCommands(): Promise<unknown>;
    registerCommand(command: Command, filename?: string): void;
    private setupMessageEvent;
}
export {};
