import InteractionHandler from "../handlers/InteractionHandler";
interface MessageContextMenuInteractionOptions {
    name: string;
    disabled?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    defaultPermissions?: Array<string>;
}
export default class MessageContextMenu {
    handler: InteractionHandler;
    client: any;
    type: string;
    name: string;
    disabled: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    defaultPermissions?: Array<string>;
    constructor(handler: InteractionHandler, filename: string, options?: MessageContextMenuInteractionOptions);
    /**
     * @param interaction The Discord.js interaction object
     * @param additionalParams Parameters that were passed in runInteraction()
     *
     * @override
     * */
    run(interaction: any, additionalParams?: any): void;
}
export {};
