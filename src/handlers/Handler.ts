import DirectoryReferenceError from "../errors/DirectoryReferenceError";

import { Client } from "discord.js";
import { EventEmitter } from "events";
import { glob } from "glob";
import Verificators from "../util/Verificators";
import * as path from "path";
import * as fs from "fs";

interface HandlerOptions {
	client: Client;
	directory?: string | undefined;
}

export default class Handler extends EventEmitter {
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
		if (options.directory) this.setDirectory(options.directory);
		return this;
	}

	/**
	 * Sets (absolute) directory for commands
	 *
	 * @remarks This directory includes all children directories too.
	 * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
	 *
	 * @returns CommandHandler
	 * @param value
	 * */
	setDirectory(value: string) {
		if (!value) throw new DirectoryReferenceError("setDirectory(): 'value' parameter is required.");
		if (!fs.existsSync(value)) throw new DirectoryReferenceError(`setDirectory(...): Directory ${value} does not exist.`);
		this.directory = value;
		return this;
	}

	debug(message: string) {
		this.emit("debug", message);
	}

	load(emitReady: boolean = true) {
		return new Promise<any>(async (resolve, reject) => {
			this.debug(`Loading files from ${this.directory}.`);
			let instances: any[] = [];
			if (!this.directory)
				return reject(
					new DirectoryReferenceError(
						"Directory is not set. Use setDirectory(path) or specify a 'directory' key to the constructor prior to loading."
					)
				);
			if (!fs.existsSync(this.directory)) return reject(new DirectoryReferenceError(`Directory "${this.directory}" does not exist.`));
			glob(this.directory + "/**/*.js", async (err: Error | null, files: string[]) => {
				if (err) return reject(new DirectoryReferenceError("Error while loading files: " + err.message));
				if (!files.length) this.debug("No files found in supplied directory.");
				for (const file of files) {
					const parsedPath = path.parse(file);
					const Constructor = require(file);
					if (!Constructor) return this.debug(`${parsedPath} failed to load. The file was loaded but cannot be required.`);
					if (!Verificators.isClass(Constructor)) throw new TypeError(`File ${parsedPath.name} doesn't export a class.`);
					const instance = new Constructor(this, parsedPath.name);
					this.debug(`Loaded "${instance.customId || instance.name}" from file ${parsedPath.name}${parsedPath.ext}.`);
					instances.push(instance);
				}
				if (emitReady) this.emit("ready");
				resolve(instances);
			});
		});
	}
}
