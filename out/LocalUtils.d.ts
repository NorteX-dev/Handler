import { Command } from "./Command";
import CommandExecutionError from "./errors/CommandExecutionError";
import InteractionExecutionError from "./errors/InteractionExecutionError";
import { Client } from "discord.js";
export declare class LocalUtils {
    private client;
    private userCooldowns?;
    private guildCooldowns?;
    private readonly owners;
    private readonly enableDebug;
    constructor(client: Client, enableDebug: boolean, owners?: Array<string>);
    isClass(input: any): boolean;
    isOwner(userId: string): boolean;
    debug(message: string, severity?: string): void;
    verifyCommand(message: any, command: Command, userCooldowns: Map<string, number>, guildCooldowns: Map<string, number>): Promise<CommandExecutionError | undefined>;
    verifyInteraction(interaction: any): Promise<InteractionExecutionError | undefined>;
}
