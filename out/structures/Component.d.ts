import { ComponentHandler } from "../handlers/ComponentHandler";
export declare type QueryingMode = "exact" | "startsWith" | "includes";
export declare class Component {
    handler: ComponentHandler | undefined;
    client: any;
    customId: string | undefined;
    queryingMode: QueryingMode | undefined;
    run(interaction: any, additionalParams?: any): void;
}
