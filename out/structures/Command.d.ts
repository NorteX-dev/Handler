import { ApplicationCommandOptionData } from "discord.js";
import CommandsHandler from "../handlers/CommandsHandler";
interface ApplicationCommandOptions {
    name: string;
    description: string;
    category?: string;
    options: ApplicationCommandOptionData;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    disabled?: boolean;
    defaultPermissions?: Array<string>;
}
export default class Command {
    handler: CommandsHandler;
    client: any;
    type: string;
    name: string;
    description: string;
    category: string | undefined;
    options: ApplicationCommandOptionData;
    userIds: Array<string>;
    guildIds: Array<string>;
    disabled: boolean;
    defaultPermissions?: Array<string>;
    constructor(handler: CommandsHandler, filename: string, options?: ApplicationCommandOptions);
    /**
     * @param interaction The Discord.js interaction object
     * @param additionalParams Parameters that were passed in runInteraction()
     *
     * @override
     * */
    run(interaction: any, additionalParams?: any): void;
}
export {};
