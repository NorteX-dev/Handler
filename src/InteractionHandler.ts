import { ApplicationCommand, Client, Collection, Interaction as DJSInteraction } from "discord.js";
import { EventEmitter } from "events";
import { LocalUtils } from "./LocalUtils";
import { glob } from "glob";
import * as path from "path";

import InteractionDirectoryReferenceError from "./errors/InteractionDirectoryReferenceError";
import InteractionExecutionError from "./errors/InteractionExecutionError";
import { Interaction } from "./index";

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
	 * @param options.debug Optional - Show logs in the console of the inner doings of the library
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

	public interactions: Map<string, Interaction>;
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
				for (const file of files) {
					delete require.cache[file];
					const parsedPath = path.parse(file);
					// Require command class
					const InteractionFile = require(file);
					// Check if is class
					if (!this.localUtils.isClass(InteractionFile)) throw new TypeError(`Interaction ${parsedPath.name} doesn't export any classes.`);
					// Initialize command class
					const interaction = new InteractionFile(this, this.client, parsedPath.name.toLowerCase());
					// Check if initialized class is extending Command
					if (!(interaction instanceof Interaction)) throw new TypeError(`Interaction file: ${parsedPath.name} doesn't extend the Interaction class.`);
					// Save command to map
					this.interactions.set(interaction.name, interaction);
					this.localUtils.debug(`Loaded interaction "${interaction.name}" from file "${parsedPath.base}"`);
					this.emit("load", interaction);
				}
				// if (this.findDuplicates(this.interactions)) throw new Error(`Attempt to load commands with same name: ${interaction.name}.`);
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
			if (interaction.isCommand()) {
				const slashCommand = this.interactions.get(interaction.commandName.toLowerCase());
				if (!slashCommand || slashCommand.type?.toLowerCase() !== "command") return;

				const failedReason: InteractionExecutionError | undefined = await this.localUtils.verifyInteraction(interaction);
				if (failedReason) {
					this.emit("error", failedReason, interaction);
					return;
				}

				try {
					await slashCommand.run(interaction);
				} catch (ex) {
					console.error(ex);
					this.emit(`Interaction errored while executing:\n*${ex}*`);
				}
			}
		});
	}

	private async postInteractions(force: boolean = false) {
		const fetchedInteractions = await this.client.application!.commands.fetch().catch((err) => {
			throw new Error(`Can't fetch client commands: ${err}`);
		});
		if (!fetchedInteractions) throw new TypeError("Interactions weren't fetched.");
		const changes = await this.whatChanged(fetchedInteractions);
		if (changes || force) {
			this.localUtils.debug("Changes in interaction files detected - re-creating the interactions. Please wait.");
			const formed = Array.from(this.interactions, ([_, data]) => ({
				name: data.name,
				description: data.description,
				defaultPermission: data.defaultPermission,
				options: data.options,
				type: this.convertType(data.type),
			}));
			await this.client.application!.commands.set([]).then((r) => console.log("Cleaned out old commands"));
			// @ts-ignore
			await this.client.application!.commands.set(formed).then((r) => console.log("Created all commands (" + r.size + " returned)"));
			this.localUtils.debug("Interaction changes were posted successfully. Remember to wait a bit (up to 1 hour) or kick and add the bot back to see changes.");
		} else this.localUtils.debug("No changes in interactions - not refreshing.");
	}

	private async whatChanged(interactions: Collection<string, ApplicationCommand>) {
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
			const equals = modifiedRemoteCmd.equals({
				name: localCmd.name,
				description: localCmd.description || "",
				type: this.convertType(localCmd.type),
				defaultPermission: localCmd.defaultPermission,
			});
			if (!remoteCmd.options) {
				remoteCmd.options = [];
			}
			if (!localCmd.options) {
				// @ts-ignore
				localCmd.options = [];
			}
			// @ts-ignore
			const optionsEqual = ApplicationCommand.optionsEqual(oldOptions, localCmd.options);
			if (!equals || !optionsEqual) return true;
		}
		for (let remoteCmd of fetched) {
			if (!existing.find((c) => c.name === remoteCmd.name)) {
				this.localUtils.debug("Refreshing interactions because interaction files have been deleted.");
				return true;
			}
		}
		return false;
	}

	private convertType(handlerType: string) {
		const keys: any = {
			command: "CHAT_INPUT",
			usercontext: "USER",
			rolecontext: "ROLE",
		};
		const res: string = keys[handlerType?.toLowerCase()];
		if (!res) throw new Error("convertType(): Can't convert type because invalid was specified. Valid are 'command', 'usercontext' or 'rolecontext'");
		return res;
	}
}
