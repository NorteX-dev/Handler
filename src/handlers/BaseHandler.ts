import { DirectoryReferenceError } from "../errors/DirectoryReferenceError";
import { Client } from "discord.js";
import { EventEmitter } from "events";
import * as path from "path";
import * as fs from "fs";
import Verificators from "../util/Verificators";

interface HandlerOptions {
	client: Client;
	directory?: string | undefined;
}

export class BaseHandler extends EventEmitter {
	public client: Client;
	public directory?: string;
	private files: string[] = [];

	constructor(options: HandlerOptions) {
		super();
		if (!options.client) throw new ReferenceError("BaseHandler(): options.client is required.");
		this.client = options.client;
		if (options.directory) this.setDirectory(options.directory);
		return this;
	}

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
			this.populateFilesField(this.directory);
			if (!this.files.length) this.debug("No files found in supplied directory.");
			else this.debug("Files found:\n" + this.files.map((f) => `- ${f}`).join("\n"));
			for (const file of this.files) {
				if (file.endsWith(".map")) continue;
				const parsedPath = path.parse(file);
				const MConstructor = await import(file);
				let Constructor;
				Constructor = MConstructor.default ?? MConstructor;
				if (!Constructor) {
					this.debug(`The module ${parsedPath} failed to import. The file does not have a default export.`);
					continue;
				}
				if (!Verificators.isClass(Constructor)) continue; // Fail silently
				const instance = new Constructor(this, parsedPath.name);
				this.debug(`Loaded "${instance.customId || instance.name}" from file ${parsedPath.name}${parsedPath.ext}.`);
				instances.push(instance);
			}
			if (emitReady) this.emit("ready");
			resolve(instances);
		});
	}

	populateFilesField(directory: string) {
		const filesInDirectory = fs.readdirSync(directory);
		for (const file of filesInDirectory) {
			const absolute = path.join(directory, file);
			if (fs.statSync(absolute).isDirectory()) {
				this.populateFilesField(absolute);
			} else {
				this.files.push(absolute);
			}
		}
	}
}
