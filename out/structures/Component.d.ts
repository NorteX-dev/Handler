import { ComponentHandler } from "../handlers/ComponentHandler";
import { QueryingMode } from "../decorators/components/CustomID";
import { Client } from "discord.js";
export declare class Component {
    handler: ComponentHandler | undefined;
    client: Client;
    customId: string | undefined;
    queryingMode: QueryingMode | undefined;
    run(interaction: any, additionalParams?: any): void;
}
