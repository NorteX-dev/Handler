import DirectoryReferenceError from "../errors/DirectoryReferenceError";

import { Client } from "discord.js";
import { EventEmitter } from "events";
import * as path from "path";

interface HandlerOptions {
	client: Client;
	directory?: string | undefined;
}

export class Handler extends EventEmitter {
	/**
	 * Base class for handlers. Should not be used as-is. Use a subclass instead.
	 *
	 * @param client Discord.JS Client Instance
	 * @param directory Command files directory
	 * @returns Handler
	 * */
	public client: Client;
	public directory?: string;

	constructor(options: HandlerOptions) {
		super();
		if (!options.client) throw new ReferenceError("Handler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory;
		return this;
	}

	/**
	 * Sets directory for commands
	 *
	 * @remarks This directory includes all children directories too.
	 * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
	 *
	 * @returns CommandHandler
	 * @param value
	 * */
	setDirectory(value: string) {
		if (!value) throw new DirectoryReferenceError("setDirectory(): path parameter is required.");
		this.directory = path.join(process.cwd(), value);
		return this;
	}
}
