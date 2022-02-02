import { CommandHandler } from "../handlers/CommandHandler";
interface MessageContextMenuInteractionOptions {
    name: string;
    disabled?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
}
export declare class MessageContextMenuInteraction {
    handler: CommandHandler;
    client: any;
    type: string;
    name: string;
    disabled: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    opts?: any;
    constructor(handler: CommandHandler, client: any, name: string, options?: MessageContextMenuInteractionOptions);
    run(userContextMenuInteraction: any): void;
}
export {};
