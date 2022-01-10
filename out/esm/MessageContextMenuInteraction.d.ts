import { CommandHandler } from "./CommandHandler";
export declare class MessageContextMenuInteraction {
    handler: CommandHandler;
    client: any;
    name: string;
    disabled: boolean;
    type: string;
    constructor(handler: CommandHandler, client: any, name: string, options?: MessageContextMenuInteraction);
    run(userContextMenuInteraction: any): void;
}
