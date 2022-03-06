import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import { EventHandler } from "../index";

interface EventOptions {
	name: string;
	once?: boolean;
}

export class Event {
	public handler: EventHandler;
	public client: any;
	public name: string;
	public once: boolean;

	constructor(handler: EventHandler, filename: string, options?: EventOptions) {
		if (!options) options = <EventOptions>{};
		this.handler = handler;
		this.client = handler.client;
		this.name = options.name || filename;
		this.once = options.once || false;
	}

	run(args?: Array<any>) {
		throw new MethodNotOverridenError("run() method on " + this.name + " event is not present.");
	}
}
