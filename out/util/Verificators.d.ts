import { ExecutionError } from "../errors/ExecutionError";
import { CommandInteraction } from "discord.js";
import { Command } from "../structures/Command";
export default class Verificators {
    static verifyCommand(interaction: CommandInteraction, cmd: Command): Promise<ExecutionError | undefined>;
    static isClass(v: any): boolean;
}
