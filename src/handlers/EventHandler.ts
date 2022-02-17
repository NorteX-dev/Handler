import { Client } from "discord.js";
import { EventEmitter } from "events";
import { LocalUtils } from "../util/LocalUtils";
import { glob } from "glob";
import * as path from "path";

import { Event } from "../index";
import EventDirectoryReferenceError from "../errors/EventsDirectoryReferenceError";

interface HandlerOptions {
	client: Client;
	autoLoad?: boolean;
	directory?: string | undefined;
}

export class EventHandler extends EventEmitter {
	/**
	 * Initializes a handler on the client.
	 *
	 * @param client Discord.JS Client Instance
	 * @param eventsDir Event files directory
	 * @returns EventHandler
	 * */
	public client: Client;
	public directory?: string;

	public events: Map<string, Event>;
	private localUtils: LocalUtils;

	constructor(options: HandlerOptions) {
		super();
		if (!options.client) throw new ReferenceError("EventHandler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory;
		this.events = new Map();
		this.localUtils = new LocalUtils(this, this.client);
		if (options.autoLoad === undefined || !options.autoLoad) this.loadEvents();
		return this;
	}

	/**
	 * Sets directory for commands
	 *
	 * @returns EventHandler
	 *
	 * @remarks
	 * This directory includes all children directories too.
	 * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed.
	 * @param absolutePath Absolute path to directory. Recommended to concatenate it using `path.join() and process.cwd()`
	 * */
	setEventsDirectory(absolutePath: string) {
		if (!absolutePath) throw new EventDirectoryReferenceError("absolutePath parameter is required.");
		this.directory = absolutePath;
		return this;
	}

	/**
	 * Loads events into memory
	 *
	 * @returns EventHandler
	 *
	 * @remarks
	 * Requires @see {@link EventHandler.setEventsDirectory} to be executed first, or `directory` to be specified in the constructor.
	 *
	 * @returns Map<string, Event>
	 * */
	loadEvents() {
		return new Promise(async (resolve, reject) => {
			if (!this.directory) return reject(new EventDirectoryReferenceError("Events directory is not set. Use setEventsDirectory(path) prior."));
			glob(this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js", async (err: Error | null, files: string[]) => {
				if (err) return reject(new EventDirectoryReferenceError("Supplied events directory is invalid. Please ensure it exists and is absolute."));
				for (const file of files) {
					delete require.cache[file];
					const parsedPath = path.parse(file);
					const EventFile = require(file);
					if (!EventFile) return this.emit("dubug", `${parsedPath} failed to load.`);
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
