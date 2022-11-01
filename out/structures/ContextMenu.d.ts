import CommandsHandler from "../handlers/CommandsHandler";
interface IContextMenuInteractionOptions {
    name: string;
    type: "MESSAGE" | "USER";
    disabled?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    defaultPermissions?: Array<string>;
}
export default class ContextMenu {
    handler: CommandsHandler;
    client: any;
    type: "MESSAGE" | "USER";
    name: string;
    disabled: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    defaultPermissions?: Array<string>;
    constructor(handler: CommandsHandler, filename: string, options?: IContextMenuInteractionOptions);
    /**
     * @param interaction The Discord.js interaction object
     * @param additionalParams Parameters that were passed in runInteraction()
     *
     * @override
     * */
    run(interaction: any, additionalParams?: any): void;
}
export {};
