import MethodNotOverridenError from "../errors/MethodNotOverridenError";

import EventHandler from "../handlers/EventHandler";

interface EventOptions {
	name: string;
	once?: boolean;
	ws?: boolean;
}

export default class Event {
	public handler: EventHandler;
	public client: any;
	public name: string;
	public once: boolean;
	public ws: boolean;

	constructor(handler: EventHandler, filename: string, options?: EventOptions) {
		if (!options) options = <EventOptions>{};
		this.handler = handler;
		this.client = handler.client;
		this.name = options.name || filename;
		this.once = options.once || false;
		this.ws = options.ws || false;
	}

	run(args?: any) {
		throw new MethodNotOverridenError("run() method on " + this.name + " event is not present.");
	}
}
