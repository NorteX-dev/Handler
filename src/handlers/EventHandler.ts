import { Client } from "discord.js";

import { Event } from "../structures/Event";
import { BaseHandler } from "./BaseHandler";

interface HandlerOptions {
	client: Client;
	autoLoad?: boolean;
	directory?: string | undefined;
}

export class EventHandler extends BaseHandler {
	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("EventHandler(): options.client is required.");
		this.client = options.client;
		if (options.autoLoad === undefined || options.autoLoad === false) this.loadEvents();
		return this;
	}

	loadEvents() {
		return new Promise<EventHandler>(async (res, rej) => {
			const files = await this.load().catch(rej);
			files.forEach((event: Event) => this.registerEvent(event));
			return res(this);
		});
	}

	registerEvent(event: Event): Event {
		if (!(event instanceof Event)) throw new TypeError("registerEvent(): event parameter must be an instance of Event.");

		// Verify & define defaults for optional fields
		if (!event.name) {
			throw new Error("registerEvent(): Can't register event that does not have a name. Define the event name with the @Name decorator.");
		}
		if (!event.once) event.once = false;
		// Define handler and client properties on class
		Object.defineProperty(event, "handler", { value: this });
		Object.defineProperty(event, "client", { value: this.client });

		this.client[event.once ? "once" : "on"](event.name, (...args) => {
			event.run(...args);
		});
		this.emit("load", event);
		this.debug(`Registered event "${event.name}".`);
		return event;
	}
}
