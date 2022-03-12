import { CommandHandler } from "../handlers/CommandHandler";
interface ComponentInteractionOptions {
    customId: string;
    queryingMode: "exact" | "includes" | "startsWith";
}
export declare class ComponentInteraction {
    handler: CommandHandler;
    client: any;
    type: string;
    customId: string;
    name: string;
    queryingMode: string;
    constructor(handler: CommandHandler, filename: string, options?: ComponentInteractionOptions);
    run(interaction: any, ...additionalParams: any): void;
}
export {};
