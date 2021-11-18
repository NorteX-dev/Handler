import { CommandHandler } from "./CommandHandler";
interface UserContextMenuInteractionOptions {
    name: string;
    disabled?: boolean;
}
export declare class UserContextMenuInteraction {
    handler: CommandHandler;
    client: any;
    name: string;
    disabled: boolean;
    type: string;
    constructor(handler: CommandHandler, client: any, name: string, options?: UserContextMenuInteractionOptions);
    run(userContextMenuInteraction: any): void;
}
export {};
