import ComponentHandler from "../handlers/ComponentHandler";
interface ComponentOptions {
    customId: string;
    queryingMode: "exact" | "includes" | "startsWith";
}
export default class Component {
    handler: ComponentHandler;
    client: any;
    type: string;
    customId: string;
    queryingMode: string;
    constructor(handler: ComponentHandler, filename: string, options?: ComponentOptions);
    /**
     * @param interaction The Discord.js interaction object
     * @param additionalParams Parameters that were passed in runInteraction()
     *
     * @override
     * */
    run(interaction: any, additionalParams?: any): void;
}
export {};
