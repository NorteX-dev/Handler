import CommandDirectoryReferenceError from "./errors/CommandDirectoryReferenceError";

import { Client, Message } from "discord.js";
import { EventEmitter } from "events";
import { Command } from "./Command";
import { LocalUtils } from "./LocalUtils";
import { glob } from "glob";
import * as path from "path";

import CommandExecutionError from "./errors/CommandExecutionError";

interface HandlerOptions {
	client: Client;
	directory: string | undefined;
	prefix: string;
	owners: Array<string>;
	autoLoad: boolean;
}

export class CommandHandler extends EventEmitter {
	/*
	 * Initializes a handler on the client.
	 *
	 * @param client Discord.JS Client Instance
	 * @param commandDir Command files directory
	 * @returns CommandHandler
	 * @example
	 * ```js
	 * const { CommandHandler } = require("@nortex-dev/handler");
	 * const handler = new CommandHandler({ client: client });
	 * ```
	 * */
	public client: Client;
	public directory: string | undefined;
	public commands: Map<string, Command>;
	public aliases: Map<string, string>;
	public prefix: string;
	public owners: Array<string>;
	private readonly userCooldowns: Map<string, number>;
	private readonly guildCooldowns: Map<string, number>;
	private localUtils: LocalUtils;

	constructor(options: HandlerOptions) {
		super();
		if (!options.client) throw new ReferenceError("CommandHandler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory;
		this.prefix = options.prefix || "?";
		this.owners = options.owners || [];
		this.commands = new Map();
		this.aliases = new Map();
		this.userCooldowns = new Map();
		this.guildCooldowns = new Map();
		this.localUtils = new LocalUtils(this, this.client, this.owners);
		this.setupMessageEvent();
		if (options.autoLoad) this.loadCommands();
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
	setCommandDirectory(absolutePath: string) {
		if (!absolutePath) throw new CommandDirectoryReferenceError("absolutePath parameter is required.");
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
	loadCommands() {
		return new Promise((resolve, reject) => {
			if (!this.directory) return reject(new CommandDirectoryReferenceError("Command directory is not set. Use setCommandDirectory(path) prior."));
			glob(this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js", (err: Error | null, files: string[]) => {
				if (err) return reject(new CommandDirectoryReferenceError("Supplied command directory is invalid. Please ensure it exists and is absolute."));
				for (const file of files) {
					delete require.cache[file];
					const parsedPath = path.parse(file);
					// Require command class
					const CommandFile = require(file);
					// Check if is class
					if (!this.localUtils.isClass(CommandFile)) throw new TypeError(`registerCommand(): Command ${parsedPath.name} doesn't export any classes.`);
					// Initialize command class
					const cmd = new CommandFile(this, this.client, parsedPath.name.toLowerCase());
					this.registerCommand(cmd);
				}
			});
		});
	}

	registerCommand(command: Command, filename?: string) {
		this.commands.set(command.name, command);
		if (command.aliases.length) command.aliases.forEach((alias: string) => this.aliases.set(alias, command.name));
		this.emit("debug", `Registered command "${command.name}"${filename ? ` from file ${filename}` : ""}`);
		this.emit("load", command);
	}

	private setupMessageEvent() {
		this.client.on("messageCreate", async (message: Message) => {
			if (message.partial) await message.fetch();
			if (message.author.bot) return;

			if (!message.content.startsWith(this.prefix)) return;

			let [typedCommand, ...args] = message.content.slice(this.prefix.length).trim().split(/ +/g);

			if (!typedCommand) return;
			typedCommand = typedCommand.trim();
			// @ts-ignore
			const command = this.commands.get(typedCommand.toLowerCase()) || this.commands.get(this.aliases.get(typedCommand.toLowerCase()));
			if (!command) return;

			// Handle additional command parameters
			if (!command.allowDm && message.channel.type === "DM") return;

			const failedReason: CommandExecutionError | undefined = await this.localUtils.verifyCommand(message, command, this.userCooldowns, this.guildCooldowns);
			if (failedReason) {
				this.emit("error", failedReason, message);
				return;
			}

			try {
				await command.run(message, args);
			} catch (ex) {
				console.error(ex);
				this.emit("error", ex);
			}
		});
	}
}
