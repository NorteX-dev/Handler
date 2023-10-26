import { CommandHandler } from "../handlers/CommandHandler";
import { Client } from "discord.js";
export declare class Command {
    handler: CommandHandler | undefined;
    client: Client;
    name: string | undefined;
    description: string | undefined;
    options: any[] | undefined;
    disabled: boolean | undefined;
    defaultMemberPermissions: string | undefined;
    category: string | undefined;
    guildId: string | undefined;
    userIds: string[] | undefined;
    guildIds: string[] | undefined;
    autocomplete(interaction: any, additionalParams?: any): void;
    run(interaction: any, additionalParams?: any): void;
    toJSON(): {
        name: string | undefined;
        description: string | undefined;
        options: any[] | undefined;
        disabled: boolean | undefined;
        category: string | undefined;
        guild_id: string | undefined;
        user_ids: string[] | undefined;
        guild_ids: string[] | undefined;
        default_member_permissions: string | undefined;
    };
}
