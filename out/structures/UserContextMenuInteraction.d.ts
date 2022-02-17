import { CommandHandler } from "../handlers/CommandHandler";
interface UserContextMenuInteractionOptions {
    name: string;
    disabled?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
}
export declare class UserContextMenuInteraction {
    handler: CommandHandler;
    client: any;
    type: string;
    name: string;
    disabled: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    constructor(handler: CommandHandler, client: any, name: string, options?: UserContextMenuInteractionOptions);
    run(userContextMenuInteraction: any, ...additionalParams: any): void;
}
export {};
