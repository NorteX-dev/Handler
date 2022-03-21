import { ApplicationCommandOptionData } from "discord.js";
import InteractionHandler from "../handlers/InteractionHandler";
interface ApplicationCommandOptions {
    name: string;
    description: string;
    options: ApplicationCommandOptionData;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    disabled?: boolean;
    defaultPermission?: boolean;
    permissions: any[];
}
export default class InteractionCommand {
    handler: InteractionHandler;
    client: any;
    type: string;
    name: string;
    description: string;
    options: ApplicationCommandOptionData;
    userIds: Array<string>;
    guildIds: Array<string>;
    disabled: boolean;
    defaultPermission: boolean;
    permissions: Array<any>;
    constructor(handler: InteractionHandler, filename: string, options?: ApplicationCommandOptions);
    /**
     * @param interaction The Discord.js interaction object
     * @param additionalParams Parameters that were passed in runInteraction()
     *
     * @override
     * */
    run(interaction: any, additionalParams?: any): void;
}
export {};
