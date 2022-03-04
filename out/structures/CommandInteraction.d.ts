import { ApplicationCommandOptionData } from "discord.js";
import { CommandHandler } from "../handlers/CommandHandler";
interface CommandInteractionOptions {
    name: string;
    description: string;
    options: ApplicationCommandOptionData;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    disabled?: boolean;
    defaultPermission?: boolean;
    permissions: any[];
}
export declare class CommandInteraction {
    handler: CommandHandler;
    client: any;
    name: string;
    type: string;
    description: string | undefined;
    options: ApplicationCommandOptionData;
    userIds: Array<string>;
    guildIds: Array<string>;
    disabled: boolean;
    defaultPermission: boolean;
    permissions: any[];
    constructor(handler: CommandHandler, client: any, name: string, options?: CommandInteractionOptions);
    run(interaction: any, ...additionalParams: any): void;
}
export {};
