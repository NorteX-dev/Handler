import DirectoryReferenceError from "../errors/DirectoryReferenceError";
import ExecutionError from "../errors/ExecutionError";

import { Client, Message } from "discord.js";
import { Handler } from "./Handler";
import { Command } from "../structures/Command";
import { LocalUtils } from "../util/LocalUtils";
import { glob } from "glob";
import * as path from "path";

interface HandlerOptions {
	client: Client;
	autoLoad: boolean;
	directory?: string;
	prefix?: string;
	owners?: Array<string>;
}

export class CommandHandler extends Handler {
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
	public commands: Map<string, Command>;
	public aliases: Map<string, string>;
	public prefix?: string[];
	public owners: string[];
	private readonly userCooldowns: Map<string, number>;
	private readonly guildCooldowns: Map<string, number>;
	private localUtils: LocalUtils;

	constructor(options: HandlerOptions) {
		super(options);
		this.setPrefix(options.prefix ?? "?");
		this.owners = options.owners || [];
		this.commands = new Map();
		this.aliases = new Map();
		this.userCooldowns = new Map();
		this.guildCooldowns = new Map();
		this.localUtils = new LocalUtils();
		if (options.autoLoad === undefined || !options.autoLoad) this.loadCommands();
		return this;
	}

	/**
	 * Sets a prefix
	 *
	 * @param prefix Prefix to set
	 *
	 * @returns CommandHandler
	 * */
	setPrefix(prefix: string | string[]) {
		if (prefix === undefined) throw new ReferenceError("setPrefix(): prefix parameter is required as a string or string[].");
		if (typeof prefix === "string") prefix = [prefix];
		this.prefix = prefix;
		return this;
	}

	/**
	 * Loads classic message commands into memory
	 *
	 * @returns CommandHandlers
	 *
	 * @remarks
	 * Requires @see {@link CommandHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
	 *
	 * @returns Map<string, Command>
	 * */
	loadCommands() {
		return new Promise((resolve, reject) => {
			if (!this.directory) return reject(new DirectoryReferenceError("Command directory is not set. Use setDirectory(path) prior."));
			glob(path.join(process.cwd(), this.directory), async (err: Error | null, files: string[]) => {
				if (err) return reject(new DirectoryReferenceError("Supplied command directory is invalid. Please ensure it exists and is relative to project root."));
				for (const file of files) {
					const parsedPath = path.parse(file);
					// Require command class
					const CommandFile = require(file);
					if (!CommandFile) return this.emit("dubug", `${parsedPath} failed to load.`);
					// Check if is class
					if (!this.localUtils.isClass(CommandFile)) throw new TypeError(`Command ${parsedPath.name} doesn't export any of the correct classes.`);
					// Initialize command class
					const cmd = new CommandFile(this, parsedPath.name);
					this.registerCommand(cmd);
					resolve(this.commands);
				}
			});
		});
	}

	/**
	 * Manually register an instanced command. This should not be needed when using loadCommands().
	 *
	 * @returns Command
	 *
	 * @returns Map<string, Command>
	 * */
	registerCommand(command: Command) {
		// if (!(command instanceof Command)) throw new TypeError("registerCommand(): command parameter must be an instance of Command.");
		this.commands.set(command.name, command);
		if (command.aliases?.length) command.aliases.forEach((alias: string) => this.aliases.set(alias, command.name));
		this.emit("debug", `Registered command "${command.name}".`);
		this.emit("load", command);
		return command;
	}

	/**
	 * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
	 *
	 * @returns Promise<<Command>
	 * */
	runCommand(message: Message, ...additionalOptions: any) {
		return new Promise<Command>(async (resolve, reject) => {
			if (message.partial) await message.fetch();
			let prefixes = this.prefix;
			if (!prefixes || !prefixes.length) prefixes = ["?"];
			for (let prefix of prefixes) {
				if (!message.content.startsWith(prefix)) continue;
				let [typedCommand, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

				if (!typedCommand) return;
				typedCommand = typedCommand.trim();
				// @ts-ignore
				const command = this.commands.get(typedCommand.toLowerCase()) || this.commands.get(this.aliases.get(typedCommand.toLowerCase()));
				if (!command) return reject(new ExecutionError("Command not found.", "COMMAND_NOT_FOUND", { query: typedCommand }));

				// Handle additional command parameters
				if (!command.allowDm && message.channel.type === "DM") return reject(new ExecutionError("Command cannot be executed in DM.", "COMMAND_NOT_ALLOWED_IN_DM", { command }));

				const failedReason: ExecutionError | undefined = await this.localUtils.verifyCommand(message, command, this.userCooldowns, this.guildCooldowns);
				if (failedReason) {
					reject(failedReason);
					return;
				}

				if (command.usage) command.usage = `${prefix}${command.name} ${command.usage}` || "";

				try {
					command.run(message, args, ...additionalOptions);
					resolve(command);
				} catch (ex) {
					console.error(ex);
					reject(ex);
				}
			}
		});
	}
}
