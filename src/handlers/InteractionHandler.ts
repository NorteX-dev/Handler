import { Client, Interaction as DJSInteraction } from "discord.js";
import { Handler } from "./Handler";
import ExecutionError from "../errors/ExecutionError";
import { InteractionCommand, MessageContextMenu, UserContextMenu } from "../index";

interface HandlerOptions {
	client: Client;
	directory?: string;
	autoLoad?: boolean;
	owners?: Array<string>;
}

export class InteractionHandler extends Handler {
	/**
	 * Initializes an interaction handler on the client.
	 *
	 * @param options Interaction handler options
	 * @param options.client Discord.JS Client Instance
	 * @param options.directory Optional - Interaction files directory
	 * @param options.owners Optional - Array of superusers' ids
	 * @param options.autoLoad Optional - Automatically invoke the loadInteractions() method - requires `directory` to be set in the options
	 * @returns InteractionHandler
	 * @example
	 * ```js
	 * const { InteractionHandler } = require("@nortex/handler");
	 * const handler = new InteractionHandler({ client, directory: "./interactions" });
	 * ```
	 * */
	public client: Client;
	public directory?: string;
	public owners?: Array<string>;

	public interactions: Map<string, InteractionCommand | UserContextMenu | MessageContextMenu>;

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("InteractionHandler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory ?? undefined;
		this.owners = options.owners || [];
		this.interactions = new Map();
		if (options.autoLoad === undefined) {
			this.loadInteractions();
		}
		return this;
	}

	/**
	 * Loads interaction commands into memory
	 *
	 * @returns InteractionHandler
	 *
	 * @remarks
	 * Requires @see {@link InteractionHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
	 * {@link InteractionHandler.runInteraction} has to be run on the interactionCreate event to invoke the command run.
	 * */
	loadInteractions() {
		return new Promise(async (res, rej) => {
			const files = await this.loadAndInstance(false).catch(rej);
			files.forEach((interaction: InteractionCommand | UserContextMenu | MessageContextMenu) => this.registerInteraction(interaction));
			return res(this.interactions);
		});
	}

	/**
	 * Manually register an instanced interaction. This should not be needed when using loadInteractions().
	 *
	 * @returns Interaction
	 * */
	registerInteraction(interaction: InteractionCommand | UserContextMenu | MessageContextMenu) {
		if (!(interaction instanceof InteractionCommand || interaction instanceof UserContextMenu || interaction instanceof MessageContextMenu))
			throw new TypeError(
				"registerInteraction(): interaction parameter must be an instance of InteractionCommand, UserContextMenu, MessageContextMenu."
			);
		if (this.interactions.get(interaction.name)) throw new Error(`Interaction ${interaction.name} cannot be registered twice.`);
		this.interactions.set(interaction.type + "_" + interaction.name, interaction);
		this.debug(`Loaded interaction "${interaction.name}".`);
		this.emit("load", interaction);
		return interaction;
	}

	/**
	 * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
	 *
	 * @returns Promise<Interaction>
	 * */
	runInteraction(interaction: DJSInteraction, ...additionalOptions: any) {
		return new Promise((res, rej) => {
			if (interaction.user.bot) return rej("Bot users can't run interactions.");
			if (interaction.isCommand()) {
				this.handleCommandInteraction(interaction, ...additionalOptions)
					.then(res)
					.catch(rej);
			} else if (interaction.isContextMenu()) {
				this.handleContextMenuInteraction(interaction, ...additionalOptions)
					.then(res)
					.catch(rej);
			} else {
				throw new Error(
					"InteractionHandler#runInteraction(): Unsupported interaction type. This only supports command and context menus interactions. You should check the type beforehand, or refer to ComponentHandler() to handle components."
				);
			}
		});
	}

	/**
	 * @ignore
	 * */
	private handleCommandInteraction(interaction: any, ...additionalOptions: any) {
		return new Promise(async (res, rej) => {
			const applicationCommand = this.interactions.get("CHAT_INPUT_" + interaction.commandName.toLowerCase());
			if (!applicationCommand) return;

			const failedReason: ExecutionError | undefined = await this.localUtils.verifyInteraction(interaction, applicationCommand);
			if (failedReason) {
				rej(failedReason);
				return;
			}

			try {
				applicationCommand.run(interaction, ...additionalOptions);
				res(applicationCommand);
			} catch (ex) {
				console.error(ex);
				rej(ex);
			}
		});
	}

	/**
	 * @ignore
	 * */
	private handleContextMenuInteraction(interaction: any, ...additionalOptions: any) {
		return new Promise(async (resolve, reject) => {
			const contextMenuInt =
				this.interactions.get("USER_" + interaction.commandName.toLowerCase()) ||
				this.interactions.get("MESSAGE_" + interaction.commandName.toLowerCase());
			if (!contextMenuInt) return;

			if (interaction.targetType === "USER" && contextMenuInt.type !== "USER") return;
			if (interaction.targetType === "MESSAGE" && contextMenuInt.type !== "MESSAGE") return;

			const failedReason: ExecutionError | undefined = await this.localUtils.verifyInteraction(interaction, contextMenuInt);
			if (failedReason) {
				reject(failedReason);
				return;
			}

			try {
				contextMenuInt.run(interaction, ...additionalOptions);
				resolve(contextMenuInt);
			} catch (ex) {
				console.error(ex);
				reject(ex);
			}
		});
	}

	/**
	 * Compare the local version of the interactions to the ones in Discord API and update if needed.
	 *
	 * @returns Interaction
	 *
	 * @param {boolean} [force=false] Skip checks and set commands even if the local version is up to date.
	 * */
	public async updateInteractions(force: boolean = false) {
		let changesMade = false;
		if (force) {
			// Forcing update, automatically assume changes were made
			this.debug("Skipping checks and updating interactions.");
			changesMade = true;
		} else {
			// Fetch existing interactions and compare to loaded
			this.debug("Checking for differences.");
			if (!this.client.application)
				throw new Error(
					"updateInteractions(): client.application is undefined. Make sure you are executing updateInteractions() after the client has emitted the 'ready' event."
				);

			const fetchedInteractions = await this.client.application.commands.fetch().catch((err) => {
				throw new Error(`Can't fetch client commands: ${err}`);
			});
			if (!fetchedInteractions) throw new Error("Interactions weren't fetched.");
			changesMade = await this.checkDiff(fetchedInteractions);
		}

		if (changesMade) {
			// Filter out message components
			const interactionsArray = Array.from(this.interactions, ([_key, interaction]) => interaction).filter((r) =>
				["CHAT_INPUT", "USER", "MESSAGE"].includes(r.type)
			);
			let interactionsToSend = [];
			interactionsArray.forEach((interaction) => {
				if (interaction.type === "CHAT_INPUT" && interaction instanceof InteractionCommand) {
					interactionsToSend.push({
						type: "CHAT_INPUT",
						name: interaction.name,
						description: interaction.description,
						defaultPermission: interaction.defaultPermission,
						permissions: interaction.permissions,
						options: interaction.options,
					});
				} else if (interaction.type === "USER" && interaction instanceof UserContextMenu) {
					interactionsToSend.push({ type: "USER", name: interaction.name });
				} else if (interaction.type === "MESSAGE" && interaction instanceof MessageContextMenu) {
					interactionsToSend.push({ type: "MESSAGE", name: interaction.name });
				} else {
					this.debug(`Interaction type ${interaction.type} is not supported.`);
				}
			});
			await this.client.application?.commands
				// @ts-ignore
				.set(interactionsArray)
				.then((returned) => {
					this.debug(
						`Updated interactions (${returned.size} returned). Wait a bit (up to 1 hour) for the cache to update or kick and add the bot back to see changes.`
					);
					this.emit("ready");
				})
				.catch((err) => {
					throw new Error(`Can't update client commands: ${err}`);
				});
		} else {
			this.debug("No changes in interactions - not refreshing.");
			this.emit("ready");
		}
	}

	/**
	 * @ignore
	 * */
	private async checkDiff(interactions: any) {
		const fetched = Array.from(interactions, ([_, data]) => data);
		const existing = Array.from(this.interactions, ([_, data]) => data);
		let changesMade = false;
		for (let localCmd of existing) {
			const remoteCmd = fetched.find((f) => f.name === localCmd.name);
			if (!remoteCmd) {
				changesMade = true;
				break;
			}
			changesMade = !remoteCmd.equals(localCmd);
		}
		for (let remoteCmd of fetched) {
			if (!existing.find((c) => c.name === remoteCmd.name)) {
				this.debug("Interactions match check failed because local interaction files are missing from the filesystem. Updating...");
				changesMade = true;
				break;
			}
		}
		// Assume match
		return changesMade;
	}
}
