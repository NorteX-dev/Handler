import { Client } from "discord.js";
import { EventEmitter } from "events";
import { LocalUtils } from "./LocalUtils";
import { glob } from "glob";
import * as path from "path";

import { Event } from "./index";
import EventDirectoryReferenceError from "./errors/EventsDirectoryReferenceError";

interface HandlerOptions {
	client: Client;
	autoLoad?: boolean;
	directory?: string | undefined;
	debug?: boolean;
}

export class EventHandler extends EventEmitter {
	/*
	 * Initializes a handler on the client.
	 *
	 * @param client Discord.JS Client Instance
	 * @param commandDir Command files directory
	 * @returns CommandHandler
	 * */
	public client: Client;
	public directory?: string;
	public owners?: Array<string>;

	public events: Map<string, Event>;
	private localUtils: LocalUtils;
	private readonly enableDebug: boolean;

	constructor(options: HandlerOptions) {
		super();
		if (!options.client) throw new ReferenceError("InteractionHandler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory;
		this.enableDebug = options.debug || false;
		this.events = new Map();
		this.localUtils = new LocalUtils(this.client, true);
		if (options.autoLoad) this.loadEvents();
		return this;
	}

	/*
	 * Sets directory for commands
	 *
	 * @param commandDir Directory to look for while loading commands
	 * @returns CommandHandler
	 *
	 * @remarks
	 * This directory includes all children directories too.
	 * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
	 * */
	setEventsDirectory(absolutePath: string) {
		if (!absolutePath) throw new EventDirectoryReferenceError("absolutePath parameter is required.");
		this.directory = absolutePath;
		return this;
	}

	/*
	 * Loads classic message commands into memory
	 *
	 * @returns CommandHandler
	 *
	 * @remarks
	 * Requires @see {CommandHandler.setCommandDirectory} to be executed first, or commandDirectory to be specified in the CommandHandler constructor.
	 * */
	loadEvents() {
		return new Promise(async (resolve, reject) => {
			if (!this.directory) return reject(new EventDirectoryReferenceError("Events directory is not set. Use setEventsdirectory(path) prior."));
			glob(this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js", async (err: Error | null, files: string[]) => {
				if (err) return reject(new EventDirectoryReferenceError("Supplied events directory is invalid. Please ensure it exists and is absolute."));
				for (const file of files) {
					delete require.cache[file];
					const parsedPath = path.parse(file);
					const EventFile = require(file);
					if (!this.localUtils.isClass(EventFile)) throw new TypeError(`Event ${parsedPath.name} doesn't export any classes.`);
					const event = new EventFile(this, this.client, parsedPath.name.toLowerCase());
					if (!(event instanceof Event)) throw new TypeError(`Event file: ${parsedPath.name} doesn't extend the Event class.`);
					this.client[event.once ? "once" : "on"](event.name, (...args) => {
						event.run(...args);
					});
					this.localUtils.debug(`Set event "${event.name}" from file "${parsedPath.base}"`);
					this.emit("load", event);
				}
				this.emit("ready");
				resolve(this.events);
			});
		});
	}
}
