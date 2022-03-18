import InteractionHandler from "../handlers/InteractionHandler";
import { Interaction } from "discord.js";
interface MessageContextMenuInteractionOptions {
    name: string;
    disabled?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
}
export default class MessageContextMenu {
    handler: InteractionHandler;
    client: any;
    type: string;
    name: string;
    disabled: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    constructor(handler: InteractionHandler, filename: string, options?: MessageContextMenuInteractionOptions);
    /**
     * @param interaction The Discord.js interaction object
     * @param additionalParams Parameters that were passed in runInteraction()
     *
     * @override
     * */
    run(interaction: Interaction, ...additionalParams: any): void;
}
export {};
