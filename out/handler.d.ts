import { Client } from "discord.js";
interface HandlerOptions {
    client: Client;
    commandDir: string | undefined;
}
export declare class Handler {
    client: Client;
    private commandDirectory;
    constructor(options: HandlerOptions);
    setCommandDirectory(commandDir: string): void;
}
export {};
