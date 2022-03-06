import { ApplicationCommandOptionData } from "discord.js";
import { InteractionHandler } from "../handlers/InteractionHandler";
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
export declare class InteractionCommand {
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
    permissions: any[];
    constructor(handler: InteractionHandler, filename: string, options?: ApplicationCommandOptions);
    run(interaction: any, ...additionalParams: any): void;
}
export {};
