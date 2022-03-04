import { CommandHandler } from "../handlers/CommandHandler";
interface CommandInteractionOptions {
    customId: string | RegExp;
}
export declare class ComponentInteraction {
    handler: CommandHandler;
    client: any;
    customId: RegExp;
    constructor(handler: CommandHandler, client: any, name: string, options?: CommandInteractionOptions);
    run(interaction: any, ...additionalParams: any): void;
}
export {};
