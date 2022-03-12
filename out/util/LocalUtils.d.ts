import { Command } from "../structures/Command";
import ExecutionError from "../errors/ExecutionError";
import { Interaction } from "discord.js";
import { UserContextMenu } from "../structures/UserContextMenu";
import { InteractionCommand } from "../structures/InteractionCommand";
import { MessageContextMenu } from "../structures/MessageContextMenu";
/**
 * @ignore
 * */
export declare class LocalUtils {
    constructor();
    isClass(input: any): boolean;
    isOwner(owners: Array<string> | undefined, userId: string): boolean;
    verifyCommand(message: any, commandObject: Command, userCooldowns: Map<string, number>, guildCooldowns: Map<string, number>): Promise<ExecutionError | undefined>;
    verifyInteraction(interactionEvent: Interaction, interactionObject: InteractionCommand | MessageContextMenu | UserContextMenu): Promise<ExecutionError | undefined>;
}
