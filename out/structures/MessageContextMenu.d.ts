import { InteractionHandler } from "../handlers/InteractionHandler";
interface MessageContextMenuInteractionOptions {
    name: string;
    disabled?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
}
export declare class MessageContextMenu {
    handler: InteractionHandler;
    client: any;
    type: string;
    name: string;
    disabled: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    constructor(handler: InteractionHandler, client: any, filename: string, options?: MessageContextMenuInteractionOptions);
    run(userContextMenuInteraction: any, ...additionalParams: any): void;
}
export {};
