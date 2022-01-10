import { Command } from "../structures/Command";
import CommandExecutionError from "../errors/CommandExecutionError";
import InteractionExecutionError from "../errors/InteractionExecutionError";
import { Client } from "discord.js";
import { CommandHandler } from "../handlers/CommandHandler";
import { EventHandler } from "../handlers/EventHandler";
import { InteractionHandler } from "../handlers/InteractionHandler";
/**
 * @ignore
 * */
export declare class LocalUtils {
    private handler;
    private client;
    private userCooldowns?;
    private guildCooldowns?;
    private readonly owners;
    constructor(handler: CommandHandler | EventHandler | InteractionHandler, client: Client, owners?: Array<string>);
    isClass(input: any): boolean;
    isOwner(userId: string): boolean;
    verifyCommand(message: any, command: Command, userCooldowns: Map<string, number>, guildCooldowns: Map<string, number>): Promise<CommandExecutionError | undefined>;
    verifyInteraction(interaction: any): Promise<InteractionExecutionError | undefined>;
}
