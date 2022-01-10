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
}
export declare class CommandInteraction {
    handler: CommandHandler;
    client: any;
    name: string;
    description: string | undefined;
    options: ApplicationCommandOptionData;
    userIds: Array<string>;
    guildIds: Array<string>;
    disabled: boolean;
    defaultPermission: boolean;
    type: string;
    constructor(handler: CommandHandler, client: any, name: string, options?: CommandInteractionOptions);
    run(interaction: any): void;
}
export {};
