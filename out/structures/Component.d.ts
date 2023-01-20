import { ComponentHandler } from "../handlers/ComponentHandler";
import { QueryingMode } from "../decorators/components/CustomID";
export declare class Component {
    handler: ComponentHandler | undefined;
    client: any;
    customId: string | undefined;
    queryingMode: QueryingMode | undefined;
    run(interaction: any, additionalParams?: any): void;
}
