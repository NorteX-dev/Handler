/// <reference types="node" />
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { Command } from "./Command";
interface HandlerOptions {
    client: Client;
    autoLoad: boolean;
    directory: string | undefined;
    prefix: string;
    owners: Array<string>;
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
    constructor(options: HandlerOptions);
    setCommandDirectory(absolutePath: string): this;
    loadCommands(): Promise<unknown>;
    registerCommand(command: Command, filename?: string): void;
    private setupMessageEvent;
}
export {};
