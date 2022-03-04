import { CommandHandler } from "../handlers/CommandHandler";
interface ComponentInteractionOptions {
    customId: string;
}
export declare class ComponentInteraction {
    handler: CommandHandler;
    client: any;
    type: string;
    customId: string;
    name: string;
    constructor(handler: CommandHandler, client: any, name: string, options?: ComponentInteractionOptions);
    run(interaction: any, ...additionalParams: any): void;
}
export {};
