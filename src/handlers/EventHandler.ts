import { Client } from "discord.js";

import { Command, Event } from "../index";
import { Handler } from "./Handler";

interface HandlerOptions {
	client: Client;
	autoLoad?: boolean;
	directory?: string | undefined;
}

export class EventHandler extends Handler {
	/**
	 * Initializes an event handler on the client.
	 *
	 * @returns EventHandler
	 * @param options The options to initialize the handler with.
	 * @param options.client The client to initialize the handler with.
	 * @param options.autoLoad Whether or not to automatically load the events.
	 * @param options.directory The directory to load the events from.
	 * */

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("EventHandler(): options.client is required.");
		this.client = options.client;
		if (options.autoLoad === undefined || options.autoLoad === false) this.loadEvents();
		return this;
	}

	/**
	 * Loads events & creates the event emitter handlers.
	 *
	 * @returns Promise<EventHandler>
	 *
	 * @remarks
	 * Requires @see {@link EventHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
	 * */
	loadEvents() {
		return new Promise<EventHandler>(async (res, rej) => {
			const files = await this.loadAndInstance().catch(rej);
			files.forEach((event: Event) => this.registerEvent(event));
			return res(this);
		});
	}

	/**
	 * Manually register an instanced event. This should not be needed when using loadEvents().
	 *
	 * @returns Command
	 * */
	registerEvent(event: Event) {
		if (!(event instanceof Event)) throw new TypeError("registerCommand(): event parameter must be an instance of Event.");
		this.client[event.once ? "once" : "on"](event.name, (...args) => {
			event.run(...args);
		});
		this.emit("load", event);
		this.debug(`Registered command "${event.name}".`);
		return event;
	}
}
