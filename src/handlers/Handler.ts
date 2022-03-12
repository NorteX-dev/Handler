import DirectoryReferenceError from "../errors/DirectoryReferenceError";

import { Client } from "discord.js";
import { EventEmitter } from "events";
import { glob } from "glob";
import { LocalUtils } from "../util/LocalUtils";
import { CommandHandler } from "./CommandHandler";
import * as path from "path";
import * as fs from "fs";

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
	public localUtils: LocalUtils;

	constructor(options: HandlerOptions) {
		super();
		if (!options.client) throw new ReferenceError("Handler(): options.client is required.");
		this.client = options.client;
		this.localUtils = new LocalUtils();
		if (options.directory) this.setDirectory(options.directory);
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
		if (!value) throw new DirectoryReferenceError("setDirectory(): 'path' parameter is required.");
		const dirPath = path.join(process.cwd(), value);
		if (!fs.existsSync(dirPath)) throw new DirectoryReferenceError(`setDirectory(...): Directory ${dirPath} does not exist.`);
		this.directory = dirPath;
		return this;
	}

	debug(message: string) {
		this.emit("debug", message);
	}

	loadAndInstance(emitReady: boolean = true) {
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
					if (!this.localUtils.isClass(Constructor)) throw new TypeError(`File ${parsedPath.name} doesn't export a class.`);
					const instance = new Constructor(this, parsedPath.name);
					this.debug(`Instantiated "${instance.customId || instance.name}" from file ${parsedPath.name}${parsedPath.ext}.`);
					instances.push(instance);
				}
				if (emitReady) this.emit("ready");
				resolve(instances);
			});
		});
	}
}
