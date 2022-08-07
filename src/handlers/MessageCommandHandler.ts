import ExecutionError from "../errors/ExecutionError";

import { Client, Message, ChannelType } from "discord.js";
import BaseHandler from "./BaseHandler";
import MessageCommand from "../structures/MessageCommand";
import Verificators from "../util/Verificators";

interface HandlerOptions {
	client: Client;
	autoLoad?: boolean;
	directory?: string;
	prefix?: string;
	owners?: Array<string>;
}

export default class MessageCommandHandler extends BaseHandler {
	/**
	 * Initializes a handler on the client.
	 *
	 * @param client Discord.JS Client Instance
	 * @param directory MessageCommand files directory
	 * @param prefix MessageCommand prefix
	 * @param owners Array of owners
	 * @param autoLoad If undefined or true, will auto load commands; explicitely specify "false" to not load commands automatically
	 * @returns MessageCommandHandler
	 * @example
	 * ```js
	 * const { MessageCommandHandler } = require("@nortex-dev/handler");\
	 * const handler = new MessageCommandHandler({ client: client });
	 * ```
	 * */
	public commands: MessageCommand[];
	public aliases: Map<string, string>;
	public prefix?: string[];
	public owners: string[];
	private readonly userCooldowns: Map<string, number>;
	private readonly guildCooldowns: Map<string, number>;

	constructor(options: HandlerOptions) {
		super(options);
		this.owners = options.owners || [];
		this.commands = [];
		this.aliases = new Map();
		this.userCooldowns = new Map();
		this.guildCooldowns = new Map();
		this.setPrefix(options.prefix ?? "?");
		if (options.autoLoad === undefined || options.autoLoad === false) this.loadCommands();
		return this;
	}

	/**
	 * Sets a prefix
	 *
	 * @param prefix Prefix to set
	 *
	 * @returns MessageCommandHandler
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
	 * @returns MessageCommand[]
	 *
	 * @remarks
	 * Requires @see {@link MessageCommandHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
	 * */
	loadCommands() {
		return new Promise<MessageCommand[]>(async (res, rej) => {
			const files = await this.load().catch(rej);
			files.forEach((cmd: MessageCommand) => this.registerCommand(cmd));
			return res(this.commands);
		});
	}

	/**
	 * Manually register an instanced command. This should not be needed when using loadCommands().
	 *
	 * @returns MessageCommand
	 * */
	registerCommand(command: MessageCommand) {
		if (!(command instanceof MessageCommand)) throw new TypeError(`registerCommand(): command parameter is not an instance of Command.`);
		if (this.commands.find((c) => c.name === command.name)) throw new Error(`Command ${command.name} cannot be registered twice.`);
		this.commands.push(command);
		if (command.aliases && command.aliases.length) command.aliases.forEach((alias: string) => this.aliases.set(alias, command.name));
		this.emit("load", command);
		this.debug(`Registered command "${command.name}".`);
		return command;
	}

	/**
	 * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
	 *
	 * @returns Promise<MessageCommand>
	 * */
	runCommand(message: Message, ...additionalOptions: any) {
		return new Promise<MessageCommand>(async (resolve, reject) => {
			if (message.partial) await message.fetch();
			let prefixes = this.prefix;
			if (!prefixes || !prefixes.length) prefixes = ["?"];
			for (let prefix of prefixes) {
				if (!message.content.startsWith(prefix)) continue;
				let [typedCommand, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

				if (!typedCommand) return;
				typedCommand = typedCommand.trim();
				const command =
					this.commands.find((c) => c.name === typedCommand.toLowerCase()) ||
					this.commands.find((c) => c.name === this.aliases.get(typedCommand.toLowerCase()));
				if (!command) return reject(new ExecutionError("MessageCommand not found.", "COMMAND_NOT_FOUND", { query: typedCommand }));
				if (!(command instanceof MessageCommand))
					return reject(new ExecutionError("Attempting to run non-command class with runCommand().", "INVALID_CLASS"));

				// Handle additional command parameters
				if (!command.allowDm && message.channel.type === ChannelType.DM)
					return reject(new ExecutionError("MessageCommand cannot be executed in DMs.", "COMMAND_NOT_ALLOWED_IN_DM", { command }));

				const failedReason: ExecutionError | undefined = await Verificators.verifyCommand(
					message,
					command,
					this.userCooldowns,
					this.guildCooldowns
				);
				if (failedReason) {
					reject(failedReason);
					return;
				}

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
