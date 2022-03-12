import { InteractionHandler } from "../handlers/InteractionHandler";
interface UserContextMenuInteractionOptions {
    name: string;
    disabled?: boolean;
    userIds?: Array<string>;
    guildIds?: Array<string>;
}
export declare class UserContextMenu {
    handler: InteractionHandler;
    client: any;
    type: string;
    name: string;
    disabled: boolean;
    userIds: Array<string>;
    guildIds: Array<string>;
    constructor(handler: InteractionHandler, filename: string, options?: UserContextMenuInteractionOptions);
    run(userContextMenuInteraction: any, ...additionalParams: any): void;
}
export {};
