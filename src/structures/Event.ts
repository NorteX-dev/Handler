import { MethodNotOverridenError } from "../errors/MethodNotOverridenError";
import { EventHandler } from "../handlers/EventHandler";
import { Client } from "discord.js";

export class Event {
	public handler: EventHandler | undefined;
	public client: Client | undefined;
	public name: string | undefined;
	public once: boolean | undefined;

	run(args?: any) {
		throw new MethodNotOverridenError(`run() method on ${this.name} event is not present.`);
	}
}
