import CommandDirectoryReferenceError from "../errors/CommandDirectoryReferenceError";

import { Client, Message } from "discord.js";
import { EventEmitter } from "events";
import { Command } from "../structures/Command";
import { LocalUtils } from "../util/LocalUtils";
import { glob } from "glob";
import * as path from "path";

import CommandExecutionError from "../errors/CommandExecutionError";

interface HandlerOptions {
	client: Client;
	autoLoad: boolean;
	directory: string | undefined;
	prefix: string;
	owners: Array<string>;
}

export class CommandHandler extends EventEmitter {
	/**
	 * Initializes a handler on the client.
	 *
	 * @param client Discord.JS Client Instance
	 * @param directory Command files directory
	 * @param prefix Command prefix
	 * @param owners Array of owners
	 * @param autoLoad If undefined or true, will auto load commands; explicitely specify "false" to not load commands automatically
	 * @returns CommandHandler
	 * @example
	 * ```js
	 * const { CommandHandler } = require("@nortex-dev/handler");\
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
		if (options.autoLoad === undefined || !options.autoLoad) this.loadCommands();
		return this;
	}

	/**
	 * Sets directory for commands
	 *
	 * @param absolutePath Absolute path to directory. Recommended to concatenate it using `path.join() and process.cwd()`
	 * @remarks This directory includes all children directories too.
	 * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
	 *
	 * @returns CommandHandler
	 * */
	setCommandDirectory(absolutePath: string) {
		if (!absolutePath) throw new CommandDirectoryReferenceError("setCommandDirectory(): absolutePath parameter is required.");
		this.directory = absolutePath;
		return this;
	}

	/**
	 * Sets a prefix
	 *
	 * @param prefix Prefix to set
	 *
	 * @returns CommandHandler
	 * */
	setPrefix(prefix: string) {
		if (!prefix) throw new ReferenceError("setPrefix(): prefix parameter is required.");
		this.prefix = prefix;
		return this;
	}

	/**
	 * Loads classic message commands into memory
	 *
	 * @returns CommandHandlers
	 *
	 * @remarks
	 * Requires @see {@link CommandHandler.setCommandDirectory} to be executed first, or `directory` to be specified in the constructor.
	 *
	 * @returns Map<string, Command>
	 * */
	loadCommands() {
		return new Promise((resolve, reject) => {
			if (!this.directory) return reject(new CommandDirectoryReferenceError("Command directory is not set. Use setCommandDirectory(path) prior."));
			glob(this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js", async (err: Error | null, files: string[]) => {
				if (err) return reject(new CommandDirectoryReferenceError("Supplied command directory is invalid. Please ensure it exists and is absolute."));
				for (const file of files) {
					const parsedPath = path.parse(file);
					// Require command class
					const CommandFile = require(file);
					if (!CommandFile) return this.emit("dubug", `${parsedPath} failed to load.`);
					// Check if is class
					if (!this.localUtils.isClass(CommandFile)) throw new TypeError(`Command ${parsedPath.name} doesn't export any of the correct classes.`);
					// Initialize command class
					const cmd = new CommandFile(this, this.client, parsedPath.name.toLowerCase());
					this.registerCommand(cmd);
					resolve(this.commands);
				}
			});
		});
	}

	/**
	 * @ignore
	 * */
	registerCommand(command: Command, filename?: string) {
		this.commands.set(command.name, command);
		if (command.aliases?.length) command.aliases.forEach((alias: string) => this.aliases.set(alias, command.name));
		this.emit("debug", `Registered command "${command.name}"${filename ? ` from file ${filename}` : ""}`);
		this.emit("load", command);
	}

	runCommand(message: Message, ...additionalOptions: any) {
		return new Promise<Command>(async (resolve, reject) => {
			if (message.partial) await message.fetch();
			if (!message.content.startsWith(this.prefix)) return;

			let [typedCommand, ...args] = message.content.slice(this.prefix.length).trim().split(/ +/g);

			if (!typedCommand) return;
			typedCommand = typedCommand.trim();
			// @ts-ignore
			const command = this.commands.get(typedCommand.toLowerCase()) || this.commands.get(this.aliases.get(typedCommand.toLowerCase()));
			if (!command) return reject(new CommandExecutionError("Command not found.", "COMMAND_NOT_FOUND", { typedCommand }));

			// Handle additional command parameters
			if (!command.allowDm && message.channel.type === "DM") return reject(new CommandExecutionError("Command cannot be executed in DM.", "COMMAND_NOT_ALLOWED_IN_DM", { command }));

			const failedReason: CommandExecutionError | undefined = await this.localUtils.verifyCommand(message, command, this.userCooldowns, this.guildCooldowns);
			if (failedReason) {
				reject(failedReason);
				return;
			}

			if (command.usage) command.usage = `${this.prefix}${command.name} ${command.usage}` || "";

			try {
				command.run(message, args, ...additionalOptions);
				resolve(command);
			} catch (ex) {
				console.error(ex);
				reject(ex);
			}
		});
	}
}
