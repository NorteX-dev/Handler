import { Client } from "discord.js";
import { BaseHandler } from "./BaseHandler";
import { Command } from "../structures/Command";
interface HandlerOptions {
    client: Client;
    directory?: string;
    autoLoad?: boolean;
}
export declare class CommandHandler extends BaseHandler {
    client: Client;
    commands: Command[];
    directory?: string;
    constructor(options: HandlerOptions);
    loadCommands(): Promise<unknown>;
    registerCommand(cmd: Command): void;
    runCommand(interaction: any, ...additionalOptions: any): Promise<unknown>;
    updateInteractions(force?: boolean): Promise<boolean>;
    formatAndSend(commands: Command[]): Promise<boolean>;
    private handleCommandRun;
    private handleAutocomplete;
    private checkDiff;
}
export {};
