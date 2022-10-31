import { MethodNotOverridenError } from "../errors/MethodNotOverridenError";
import { ComponentHandler } from "../handlers/ComponentHandler";

export type QueryingMode = "exact" | "startsWith" | "includes";

export class Component {
	public handler: ComponentHandler | undefined;
	public client: any;
	public customId: string | undefined;
	public queryingMode: QueryingMode | undefined;

	run(interaction: any, additionalParams?: any) {
		throw new MethodNotOverridenError(`run() method on ${this.customId} interaction is not present.`);
	}
}
