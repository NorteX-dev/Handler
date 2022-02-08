import { CommandHandler } from "./CommandHandler";
interface MessageComponentInteractionOptions {
    name: string;
    disabled?: boolean;
}
export declare class MessageComponentInteraction {
    handler: CommandHandler;
    client: any;
    name: string;
    disabled: boolean;
    constructor(handler: CommandHandler, client: any, name: string, options?: MessageComponentInteractionOptions);
    run(userContextMenuInteraction: any): void;
}
export {};
