import { Client } from "discord.js";
import { LocalUtils } from "../util/LocalUtils";
import { glob } from "glob";
import * as path from "path";

import { Event } from "../index";
import DirectoryReferenceError from "../errors/DirectoryReferenceError";
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
	 * @param client Discord.JS Client Instance
	 * @param directory Event files directory
	 * @returns EventHandler
	 * */
	public events: Map<string, Event>;
	private localUtils: LocalUtils;

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("EventHandler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory;
		this.events = new Map();
		this.localUtils = new LocalUtils();
		if (options.autoLoad === undefined || !options.autoLoad) this.loadEvents();
		return this;
	}

	/**
	 * Loads events & creates the event emitter handlers.
	 *
	 * @returns EventHandler
	 *
	 * @remarks
	 * Requires @see {@link EventHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
	 *
	 * @returns Map<string, Event>
	 * */
	loadEvents() {
		return new Promise(async (resolve, reject) => {
			if (!this.directory) return reject(new DirectoryReferenceError("Events directory is not set. Use setDirectory(path) prior."));
			glob(path.join(process.cwd(), this.directory), async (err: Error | null, files: string[]) => {
				if (err) return reject(new DirectoryReferenceError("Supplied events directory is invalid. Please ensure it exists and is absolute."));
				for (const file of files) {
					delete require.cache[file];
					const parsedPath = path.parse(file);
					const EventFile = require(file);
					if (!EventFile) return this.emit("debug", `${parsedPath} failed to load.`);
					if (!this.localUtils.isClass(EventFile)) throw new TypeError(`Event ${parsedPath.name} doesn't export any of the correct classes.`);
					const event = new EventFile(this, this.client, parsedPath.name);
					if (!(event instanceof Event)) throw new TypeError(`Event file: ${parsedPath.name} doesn't extend the Event class.`);
					this.client[event.once ? "once" : "on"](event.name, (...args) => {
						event.run(...args);
					});
					this.emit("debug", `Set event "${event.name}" from file "${parsedPath.base}"`);
					this.emit("load", event);
				}
				this.emit("ready");
				resolve(this.events);
			});
		});
	}
}
