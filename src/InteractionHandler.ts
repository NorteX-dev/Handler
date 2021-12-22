import { ApplicationCommand, Client, Collection, Interaction as DJSInteraction, ContextMenuInteraction as DJSContextMenuInteraction } from "discord.js";
import { EventEmitter } from "events";
import { LocalUtils } from "./LocalUtils";
import { glob } from "glob";
import * as path from "path";

import InteractionDirectoryReferenceError from "./errors/InteractionDirectoryReferenceError";
import InteractionExecutionError from "./errors/InteractionExecutionError";
import { CommandInteraction, MessageContextMenuInteraction, UserContextMenuInteraction } from "./index";

interface HandlerOptions {
	client: Client;
	autoLoad?: boolean;
	directory?: string | undefined;
	disableInteractionModification?: boolean;
	owners?: Array<string>;
	forceInteractionUpdate?: boolean;
}

export class InteractionHandler extends EventEmitter {
	/*
	 * Initializes an interaction handler on the client.
	 *
	 * @param options Interaction handler options
	 * @param options.client Discord.JS Client Instance
	 * @param options.interactionsDir Optional - Interaction files directory
	 * @param options.owners Optional - Array of superusers' ids
	 * @param options.disableInteractionModification Optional - Forcibly stop any modification of command applications
	 * @param options.forceInteractionUpdate Optional - Forcibly update command applications every load - this option can get you rate limited if the bot restarts often
	 * @param options.autoLoad Optional - Automatically invoke the loadInteractions() method - requires interactionsDir to be set in the options
	 * @returns InteractionHandler
	 * @example
	 * ```js
	 * const { InteractionHandler } = require("@nortex-dev/handler");
	 * const handler = new InteractionHandler({ client: client });
	 * ```
	 * */
	public client: Client;
	public directory?: string;
	public owners?: Array<string>;
	public disableInteractionModification?: boolean;
	public forceInteractionUpdate?: boolean;

	public interactions: Map<string, CommandInteraction | UserContextMenuInteraction | MessageContextMenuInteraction>;
	private localUtils: LocalUtils;

	constructor(options: HandlerOptions) {
		super();
		if (!options.client) throw new ReferenceError("InteractionHandler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory;
		this.owners = options.owners || [];
		this.disableInteractionModification = options.disableInteractionModification || false;
		this.forceInteractionUpdate = options.forceInteractionUpdate || false;
		this.interactions = new Map();
		this.localUtils = new LocalUtils(this, this.client, this.owners);
		this.setupInteractionEvent();
		if (options.autoLoad) this.loadInteractions();
		if (!this.client) {
			throw new ReferenceError("InteractionHandler(): options.client is required.");
		}
		console.log(this.client.application);
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
	setInteractionsDirectory(absolutePath: string) {
		if (!absolutePath) throw new InteractionDirectoryReferenceError("absolutePath parameter is required.");
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
	loadInteractions() {
		return new Promise(async (resolve, reject) => {
			if (!this.directory) return reject(new InteractionDirectoryReferenceError("Interactions directory is not set. Use setInteractionsDirectory(path) prior."));
			glob(this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js", async (err: Error | null, files: string[]) => {
				if (err) return reject(new InteractionDirectoryReferenceError("Supplied interactions directory is invalid. Please ensure it exists and is absolute."));
				const duplicates = [];
				for (const file of files) {
					delete require.cache[file];
					const parsedPath = path.parse(file);
					// Require command class
					let InteractionFile;
					try {
						// Attempt CJS import
						InteractionFile = require(file);
					} catch {
						// Attempt ESM import
						InteractionFile = import(file);
					}
					if (!InteractionFile) return this.emit("dubug", `${parsedPath} failed to load.`);
					// Check if is class
					if (!this.localUtils.isClass(InteractionFile)) throw new TypeError(`Interaction ${parsedPath.name} doesn't export any classes.`);
					// Initialize command class
					const interaction = new InteractionFile(this, this.client, parsedPath.name.toLowerCase());
					// Check if initialized class is extending Command
					if (!(interaction instanceof CommandInteraction || interaction instanceof UserContextMenuInteraction || interaction instanceof MessageContextMenuInteraction))
						throw new TypeError(
							`Interaction file: ${parsedPath.name} doesn't extend one of the valid the interaction classes: CommandInteraction, UserContextMenuInteraction, MessageContextMenuInteraction.`
						);
					// Save command to map
					if (this.interactions.get(interaction.type + "_" + interaction.name)) {
						duplicates.push(interaction);
						continue;
					}
					this.interactions.set(interaction.type + "_" + interaction.name, interaction);
					this.emit("debug", `Loaded interaction "${interaction.name}" from file "${parsedPath.base}"`);
					this.emit("load", interaction);
				}
				if (duplicates?.length) throw new Error(`Loading interaction with the same name: ${duplicates.map((d) => d.name).join(", ")}.`);
				if (!this.disableInteractionModification)
					this.client.on("ready", async () => {
						await this.postInteractions(this.forceInteractionUpdate);
					});
				this.emit("ready");
				resolve(this.interactions);
			});
		});
	}

	private setupInteractionEvent() {
		this.client.on("interactionCreate", async (interaction: DJSInteraction) => {
			if (interaction.user.bot) return;
			if (interaction.isCommand()) this.handleCommandInteraction(interaction);
			if (interaction.isContextMenu()) this.handleContextMenuInteraction(interaction);
		});
	}

	private async handleCommandInteraction(interaction: any) {
		const slashCommand = this.interactions.get("CHAT_INPUT_" + interaction.commandName.toLowerCase()); // Changed in v2.3.0
		if (!slashCommand) return;

		const failedReason: InteractionExecutionError | undefined = await this.localUtils.verifyInteraction(interaction);
		if (failedReason) {
			this.emit("error", failedReason, interaction);
			return;
		}

		try {
			await slashCommand.run(interaction);
		} catch (ex) {
			console.error(ex);
			this.emit("error", ex, interaction);
		}
	}

	private async handleContextMenuInteraction(interaction: DJSContextMenuInteraction) {
		const contextMenuInt = this.interactions.get("USER_" + interaction.commandName.toLowerCase()) || this.interactions.get("MESSAGE_" + interaction.commandName.toLowerCase());
		if (!contextMenuInt) return;

		// @ts-ignore
		if (interaction.targetType === "USER" && contextMenuInt.type !== "USER") return;
		// @ts-ignore
		if (interaction.targetType === "MESSAGE" && contextMenuInt.type !== "MESSAGE") return;

		const failedReason: InteractionExecutionError | undefined = await this.localUtils.verifyInteraction(interaction);
		if (failedReason) return this.emit("error", failedReason, interaction);

		try {
			await contextMenuInt.run(interaction);
		} catch (ex) {
			console.error(ex);
			this.emit("error", ex, interaction);
		}
	}

	private async postInteractions(force: boolean = false) {
		let changes;
		if (!force) {
			const fetchedInteractions = await this.client.application!.commands.fetch().catch((err) => {
				throw new Error(`Can't fetch client commands: ${err}`);
			});
			if (!fetchedInteractions) throw new TypeError("Interactions weren't fetched.");
			changes = await this.didChange(fetchedInteractions);
		}
		if (changes || force) {
			this.emit("debug", "Changes in interaction files detected - re-creating the interactions. Please wait.");
			const formed = Array.from(this.interactions, ([_, data]) => {
				// @ts-ignore
				if (data.type === "CHAT_INPUT") return { name: data.name, description: data.description, defaultPermission: data.defaultPermission, options: data.options, type: data.type };
				if (data.type === "USER") return { name: data.name, type: data.type };
				if (data.type === "MESSAGE") return { name: data.name, type: data.type };
			});
			// await this.client.application!.commands.set([]).then((r) => this.emit("debug", "Cleaned out old commands"));
			// @ts-ignore
			await this.client.application!.commands.set(formed).then((r) => this.emit("debug", "Created all commands (" + r.size + " returned)"));
			this.emit("debug", "Interaction changes were posted successfully. Remember to wait a bit (up to 1 hour) or kick and add the bot back to see changes.");
		} else this.emit("debug", "No changes in interactions - not refreshing.");
	}

	private async didChange(interactions: Collection<string, ApplicationCommand>) {
		const fetched = Array.from(interactions, ([_, data]) => data);
		const existing = Array.from(this.interactions, ([_, data]) => data);
		for (let localCmd of existing) {
			const remoteCmd = fetched.find((cmd) => cmd.name === localCmd.name);
			if (!remoteCmd) return true;
			const oldOptions = remoteCmd.options;
			const modifiedRemoteCmd: any = remoteCmd;
			delete modifiedRemoteCmd.options;
			delete modifiedRemoteCmd.version;
			delete modifiedRemoteCmd.guild;
			delete modifiedRemoteCmd.id;
			delete modifiedRemoteCmd.applicationId;
			const modifiedLocalCmd: any = {
				name: localCmd.name,
				type: localCmd.type,
			};
			const equals = modifiedRemoteCmd.equals(modifiedLocalCmd);
			if (localCmd.type === "COMMAND") {
				// @ts-ignore
				modifiedLocalCmd.description = localCmd.description;
				// @ts-ignore
				modifiedLocalCmd.defaultPermission = localCmd.defaultPermission;
				if (!remoteCmd.options) remoteCmd.options = [];
				// @ts-ignore
				if (!localCmd.options) localCmd.options = [];
				// @ts-ignore
				const optionsEqual = ApplicationCommand.optionsEqual(oldOptions, localCmd.options);
				if (!equals || !optionsEqual) return true;
			}
			// @ts-ignore
			if (!equals) return true;
		}
		for (let remoteCmd of fetched) {
			if (!existing.find((c) => c.name === remoteCmd.name)) {
				this.emit("debug", "Refreshing interactions because interaction files have been deleted.");
				return true;
			}
		}
		return false;
	}
}
