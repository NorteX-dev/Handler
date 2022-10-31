import DirectoryReferenceError from "../errors/DirectoryReferenceError";

import { Client, Partials } from "discord.js";
import { EventEmitter } from "events";
import Verificators from "../util/Verificators";
import * as path from "path";
import * as fs from "fs";

interface HandlerOptions {
	client: Client;
	directory?: string | undefined;
}

export default class BaseHandler extends EventEmitter {
	/**
	 * Base class for handlers. Should not be used as-is. Use a subclass instead.
	 *
	 * @param client Discord.JS Client Instance
	 * @param directory MessageCommand files directory
	 * @returns BaseHandler
	 * */
	public client: Client;
	public directory?: string;

	constructor(options: HandlerOptions) {
		super();
		if (!options.client) throw new ReferenceError("BaseHandler(): options.client is required.");
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
			this.loadFiles(this.directory)
				.then(async (paths) => {
					this.debug("Files found:\n" + paths.map((f) => `- ${f}`).join("\n"));
					if (!paths.length) this.debug("No files found in supplied directory.");
					for (const file of paths) {
						const parsedPath = path.parse(file);
						const MConstructor = await import(file);
						let Constructor;
						Constructor = MConstructor.default ? MConstructor.default : MConstructor;
						if (!Constructor)
							return this.debug(
								`The module ${parsedPath} failed to import. The file does not have a default export or module.exports.`
							);
						// if (!Verificators.isClass(Constructor.default)) throw new TypeError(`File ${parsedPath.name} doesn't export a class.`);
						const instance = new Constructor(this, parsedPath.name);
						this.debug(`Loaded "${instance.customId || instance.name}" from file ${parsedPath.name}${parsedPath.ext}.`);
						instances.push(instance);
					}
					if (emitReady) this.emit("ready");
					resolve(instances);
				})
				.catch((err) => {
					return reject(new DirectoryReferenceError("Error while loading files: " + err.message));
				});
		});
	}

	async loadFiles<Promise>(directory: string) {
		return new Promise<string[]>((resolve, reject) => {
			fs.readdir(directory, async (err, files) => {
				if (err) return reject(err);
				let filelist: string[] = [];
				await Promise.all(
					files.map(async (fileOrDir) => {
						if (fs.statSync(path.join(directory, fileOrDir)).isDirectory()) {
							filelist = filelist.concat(await this.loadFiles(path.join(directory, fileOrDir)));
						} else {
							filelist.push(path.join(directory, fileOrDir));
						}
					})
				);
				resolve(filelist);
			});
		});
	}
}
