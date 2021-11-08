import { ApplicationCommandOptionData, Client, CommandInteraction } from "discord.js";
import { CommandHandler } from "./CommandHandler";
interface InteractionOptions {
    name: string;
    description: string;
    type: string;
    options: ApplicationCommandOptionData;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    disabled?: boolean;
    defaultPermission?: boolean;
}
export declare class Interaction {
    handler: CommandHandler;
    client: Client;
    name: string;
    type: string;
    description: string | undefined;
    options: ApplicationCommandOptionData;
    userIds: Array<string>;
    guildIds: Array<string>;
    disabled: boolean;
    defaultPermission: boolean;
    constructor(handler: CommandHandler, client: any, name: string, options?: InteractionOptions);
    run(interaction: CommandInteraction): void;
}
export {};
