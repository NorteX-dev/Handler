import { ApplicationCommandOptionData } from "discord.js";
import { CommandHandler } from "./CommandHandler";
interface RoleContextMenuInteractionOptions {
    name: string;
    description: string;
    options: ApplicationCommandOptionData;
    userIds?: Array<string>;
    guildIds?: Array<string>;
    disabled?: boolean;
    defaultPermission?: boolean;
}
export declare class CommandInteraction {
    handler: CommandHandler;
    client: any;
    name: string;
    options: ApplicationCommandOptionData;
    userIds: Array<string>;
    guildIds: Array<string>;
    disabled: boolean;
    defaultPermission: boolean;
    constructor(handler: CommandHandler, client: any, name: string, options?: RoleContextMenuInteractionOptions);
    run(interaction: any): void;
}
export {};
