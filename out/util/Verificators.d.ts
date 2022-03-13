import ExecutionError from "../errors/ExecutionError";
import { Interaction } from "discord.js";
import Command from "../structures/Command";
import UserContextMenu from "../structures/UserContextMenu";
import InteractionCommand from "../structures/InteractionCommand";
import MessageContextMenu from "../structures/MessageContextMenu";
/**
 * @ignore
 * */
export default class Verificators {
    static isClass(input: any): boolean;
    static isOwner(owners: Array<string> | undefined, userId: string): boolean;
    static verifyCommand(message: any, commandObject: Command, userCooldowns: Map<string, number>, guildCooldowns: Map<string, number>): Promise<ExecutionError | undefined>;
    static verifyInteraction(interactionEvent: Interaction, interactionObject: InteractionCommand | MessageContextMenu | UserContextMenu): Promise<ExecutionError | undefined>;
}
