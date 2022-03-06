import DirectoryReferenceError from "../errors/DirectoryReferenceError";

import { Client } from "discord.js";
import { EventEmitter } from "events";
import * as path from "path";
import { glob } from "glob";
import * as fs from "fs";
import { LocalUtils } from "../util/LocalUtils";
import { Command } from "../structures/Command";
import { CommandHandler } from "./CommandHandler";
import { ComponentInteraction } from "../structures/ComponentInteraction";
import { Event } from "../structures/Event";
import { InteractionCommand } from "../structures/InteractionCommand";
import { UserContextMenu } from "../structures/UserContextMenu";
import { MessageContextMenu } from "../structures/MessageContextMenu";

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
		this.directory = options.directory;
		this.localUtils = new LocalUtils();
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

	debug(message: string) {
		this.emit("debug", message);
	}

	loadAndInstance() {
		return new Promise<any>(async (resolve, reject) => {
			let instances: any[] = [];
			if (!this.directory) return reject(new DirectoryReferenceError("Directory is not set. Use setDirectory(path) prior."));
			const dirPath = path.join(process.cwd(), this.directory);
			if (!fs.existsSync(dirPath)) return reject(new DirectoryReferenceError(`Directory ${dirPath} does not exist.`));
			glob(dirPath + "/**/*.js", async (err: Error | null, files: string[]) => {
				if (err) return reject(new DirectoryReferenceError("Error while loading files: " + err.message));
				if (!files.length) this.debug("No files found in supplied directory.");
				for (const file of files) {
					const parsedPath = path.parse(file);
					const Constructor = require(file);
					if (!Constructor) return this.debug(`${parsedPath} failed to load. The file was loaded but cannot be required.`);
					if (!this.localUtils.isClass(Constructor)) throw new TypeError(`File ${parsedPath.name} doesn't export a class.`);
					const instance = new Constructor(this, parsedPath.name);
					const superclassName = Object.getPrototypeOf(this).constructor.name;
					if (superclassName === "CommandHandler") {
						if (!(instance instanceof Command)) this.debug(`${parsedPath.name} is not an instance of Command.`);
					} else if (superclassName === "EventHandler") {
						if (!(instance instanceof Event)) this.debug(`${parsedPath.name} is not an instance of Event.`);
					} else if (superclassName === "InteractionHandler") {
						if (
							!(instance instanceof InteractionCommand || instance instanceof UserContextMenu || instance instanceof MessageContextMenu)
						)
							this.debug(`${parsedPath.name} is not an instance of either: InteractionCommand, UserContextMenu or MessageContextMenu.`);
					} else if (superclassName === "ComponentHandler") {
						if (!(instance instanceof ComponentInteraction)) this.debug(`${parsedPath.name} is not an instance of ComponentInteraction.`);
					} else {
						// Who knows?
						this.debug(`${parsedPath.name} is not using a supported class: ${superclassName}.`);
					}
					this.debug(`Instantiated ${instance.customId || instance.name} from file ${parsedPath.name}${parsedPath.ext}`);
					instances.push(instance);
				}
				resolve(instances);
			});
		});
	}
}
