import ExecutionError from "../errors/ExecutionError";
import { Interaction } from "discord.js";
import MessageCommand from "../structures/MessageCommand";
import Command from "../structures/Command";
import ContextMenu from "../structures/ContextMenu";
/**
 * @ignore
 * */
export default class Verificators {
    static isClass(input: any): boolean;
    static isOwner(owners: Array<string> | undefined, userId: string): boolean;
    static verifyCommand(message: any, commandObject: MessageCommand, userCooldowns: Map<string, number>, guildCooldowns: Map<string, number>): Promise<ExecutionError | undefined>;
    static verifyInteraction(interactionEvent: Interaction, interactionObject: Command | ContextMenu): Promise<ExecutionError | undefined>;
}
