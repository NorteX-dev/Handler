import ExecutionError from "../errors/ExecutionError";

import { Client, Message } from "discord.js";
import Handler from "./Handler";
import Command from "../structures/Command";
import Verificators from "../util/Verificators";

interface HandlerOptions {
	client: Client;
	autoLoad?: boolean;
	directory?: string;
	prefix?: string;
	owners?: Array<string>;
}

export default class CommandHandler extends Handler {
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
	public commands: Command[];
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
	 * @returns Command[]
	 *
	 * @remarks
	 * Requires @see {@link CommandHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
	 * */
	loadCommands() {
		return new Promise<Command[]>(async (res, rej) => {
			const files = await this.loadAndInstance().catch(rej);
			files.forEach((cmd: Command) => this.registerCommand(cmd));
			return res(this.commands);
		});
	}

	/**
	 * Manually register an instanced command. This should not be needed when using loadCommands().
	 *
	 * @returns Command
	 * */
	registerCommand(command: Command) {
		if (!(command instanceof Command)) throw new TypeError(`registerCommand(): command parameter is not an instance of Command.`);
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
	 * @returns Promise<Command>
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
				const command =
					this.commands.find((c) => c.name === typedCommand.toLowerCase()) ||
					this.commands.find((c) => c.name === this.aliases.get(typedCommand.toLowerCase()));
				if (!command) return reject(new ExecutionError("Command not found.", "COMMAND_NOT_FOUND", { query: typedCommand }));
				if (!(command instanceof Command))
					return reject(new ExecutionError("Attempting to run non-command class with runCommand().", "INVALID_CLASS"));

				// Handle additional command parameters
				if (!command.allowDm && message.channel.type === "DM")
					return reject(new ExecutionError("Command cannot be executed in DM.", "COMMAND_NOT_ALLOWED_IN_DM", { command }));

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

				if (command.usage) command.usage = `${prefix}${command.name} ${command.usage}` || "";

				// Evaluate parameters
				args = await CommandHandler.evaluateParameters(message, command, args);

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

	/**
	 * Evaluate parameters.
	 *
	 * @ignore
	 * */
	private static async evaluateParameters(message: Message, command: Command, args: string[]) {
		if (!command.parameters.length) return args;
		for (let i in command.parameters) {
			const parameter = command.parameters[i];
			let value = undefined;
			if (!args[i] && parameter.required) {
				// Parameter is required and not provided
				if (parameter.onMissing) parameter.onMissing(parameter, command, message, args);
				if (parameter.prompt) {
					const prompt =
						typeof parameter.prompt.message === "string"
							? await message.channel.send({
									content: parameter.prompt.message,
							  })
							: parameter.prompt.message(parameter, command, message, args);

					if (!prompt || !(prompt instanceof Message))
						throw new Error(
							`${command.name}: Parameter.prompt.message() in parameter: '${parameter.name}' did not return a Message instance.`
						);

					const response = await message.channel.awaitMessages({
						filter: (m: Message) => m.author.id === message.author.id,
						max: 1,
						time: parameter.prompt.timeout || 30000,
						errors: ["time"],
					});
					if (!response.size) {
						if (parameter.prompt.onTimeout) parameter.prompt.onTimeout(parameter, command, message, args);
						continue;
					}
					const responseMessage = response.first();
					if (!responseMessage) {
						// Possibly redundant but shuts up TS
						if (parameter.prompt.onTimeout) parameter.prompt.onTimeout(parameter, command, message, args);
						continue;
					}

					await prompt.delete().catch(() => {
						/*ignore problems related to deleting since they don't affect anything*/
					});
					await responseMessage.delete().catch(() => {
						/*ignore problems related to deleting since they don't affect anything*/
					});

					value = responseMessage.content;
				} else {
					continue;
				}
			}
			// Parameter is specified or it's not but it's not required
			value = value || args[i];
			if (parameter.validator) {
				const isValid = await parameter.validator(value, parameter, command, message, args);
				if (!isValid) {
					if (parameter.onInvalid) parameter.onInvalid(parameter, command, message, args);
					continue;
				}
			}

			if (parameter.transform) {
				const result = await parameter.transform(value, parameter, command, message, args);
				if (result) args[i] = result;
			} else {
				args[i] = value;
			}
		}
		return args;
	}
}
