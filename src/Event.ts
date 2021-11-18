import MethodNotOverridenError from "./errors/MethodNotOverridenError";

import { Client } from "discord.js";
import { EventHandler } from "./EventHandler";

interface EventOptions {
	name: string;
	once?: boolean;
}

export class Event {
	public handler: EventHandler;
	public client: any;
	public name: string;
	public once: boolean;

	constructor(handler: EventHandler, client: any, name: string, options?: EventOptions) {
		if (!options) options = <EventOptions>{};
		this.handler = handler;
		this.client = client;
		this.name = options.name || name;
		this.once = options.once || false;
	}

	run(...args: Array<any>) {
		throw new MethodNotOverridenError("run() method on " + this.name + " event is not present.");
	}
}
