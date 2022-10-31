import { MethodNotOverridenError } from "../errors/MethodNotOverridenError";
import { EventHandler } from "../handlers/EventHandler";

export class Event {
	public handler: EventHandler | undefined;
	public client: any;
	public name: string | undefined;
	public once: boolean | undefined;

	run(args?: any) {
		throw new MethodNotOverridenError(`run() method on ${this.name} event is not present.`);
	}
}
