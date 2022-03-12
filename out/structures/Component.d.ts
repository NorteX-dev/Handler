import { ComponentHandler } from "../handlers/ComponentHandler";
interface ComponentOptions {
    customId: string;
    queryingMode: "exact" | "includes" | "startsWith";
}
export declare class Component {
    handler: ComponentHandler;
    client: any;
    type: string;
    customId: string;
    queryingMode: string;
    constructor(handler: ComponentHandler, filename: string, options?: ComponentOptions);
    run(interaction: any, ...additionalParams: any): void;
}
export {};
