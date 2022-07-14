import { ApplicationCommand, Client, Collection, Interaction as DJSInteraction, Snowflake } from "discord.js";
import Handler from "./Handler";
import ExecutionError from "../errors/ExecutionError";
import InteractionCommand from "../structures/InteractionCommand";
import Verificators from "../util/Verificators";
import UserContextMenu from "../structures/UserContextMenu";
import MessageContextMenu from "../structures/MessageContextMenu";

interface HandlerOptions {
	client: Client;
	directory?: string;
	autoLoad?: boolean;
	owners?: string[];
}

type InteractionRunnable = InteractionCommand | UserContextMenu | MessageContextMenu;

const PERMISSION_FLAGS = {
	CREATE_INSTANT_INVITE: BigInt(1) << BigInt(0),
	KICK_MEMBERS: BigInt(1) << BigInt(1),
	BAN_MEMBERS: BigInt(1) << BigInt(2),
	ADMINISTRATOR: BigInt(1) << BigInt(3),
	MANAGE_CHANNELS: BigInt(1) << BigInt(4),
	MANAGE_GUILD: BigInt(1) << BigInt(5),
	ADD_REACTIONS: BigInt(1) << BigInt(6),
	VIEW_AUDIT_LOG: BigInt(1) << BigInt(7),
	PRIORITY_SPEAKER: BigInt(1) << BigInt(8),
	STREAM: BigInt(1) << BigInt(9),
	VIEW_CHANNEL: BigInt(1) << BigInt(10),
	SEND_MESSAGES: BigInt(1) << BigInt(11),
	SEND_TTS_MESSAGES: BigInt(1) << BigInt(12),
	MANAGE_MESSAGES: BigInt(1) << BigInt(13),
	EMBED_LINKS: BigInt(1) << BigInt(14),
	ATTACH_FILES: BigInt(1) << BigInt(15),
	READ_MESSAGE_HISTORY: BigInt(1) << BigInt(16),
	MENTION_EVERYONE: BigInt(1) << BigInt(17),
	USE_EXTERNAL_EMOJIS: BigInt(1) << BigInt(18),
	VIEW_GUILD_INSIGHTS: BigInt(1) << BigInt(19),
	CONNECT: BigInt(1) << BigInt(20),
	SPEAK: BigInt(1) << BigInt(21),
	MUTE_MEMBERS: BigInt(1) << BigInt(22),
	DEAFEN_MEMBERS: BigInt(1) << BigInt(23),
	MOVE_MEMBERS: BigInt(1) << BigInt(24),
	USE_VAD: BigInt(1) << BigInt(25),
	CHANGE_NICKNAME: BigInt(1) << BigInt(26),
	MANAGE_NICKNAMES: BigInt(1) << BigInt(27),
	MANAGE_ROLES: BigInt(1) << BigInt(28),
	MANAGE_WEBHOOKS: BigInt(1) << BigInt(29),
	MANAGE_EMOJIS_AND_STICKERS: BigInt(1) << BigInt(30),
	USE_APPLICATION_COMMANDS: BigInt(1) << BigInt(31),
	REQUEST_TO_SPEAK: BigInt(1) << BigInt(32),
	MANAGE_EVENTS: BigInt(1) << BigInt(33),
	MANAGE_THREADS: BigInt(1) << BigInt(34),
	CREATE_PUBLIC_THREADS: BigInt(1) << BigInt(35),
	CREATE_PRIVATE_THREADS: BigInt(1) << BigInt(36),
	USE_EXTERNAL_STICKERS: BigInt(1) << BigInt(37),
	SEND_MESSAGES_IN_THREADS: BigInt(1) << BigInt(38),
	USE_EMBEDDED_ACTIVITIES: BigInt(1) << BigInt(39),
	MODERATE_MEMBERS: BigInt(1) << BigInt(40),
};

export default class InteractionHandler extends Handler {
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
	public interactions: InteractionRunnable[];
	public directory?: string;
	public owners?: Array<string>;

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("InteractionHandler(): options.client is required.");
		this.client = options.client;
		this.owners = options.owners || [];
		this.interactions = [];
		if (options.autoLoad === undefined || options.autoLoad === false) this.loadInteractions();
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
			const files = await this.load(false).catch(rej);
			files.forEach((interaction: InteractionCommand | UserContextMenu | MessageContextMenu) => this.registerInteraction(interaction));
			return res(this.interactions);
		});
	}

	/**
	 * Manually register an instanced interaction. This should not be needed when using loadInteractions().
	 *
	 * @returns Interaction
	 * */
	registerInteraction(interaction: InteractionRunnable) {
		if (!(interaction instanceof InteractionCommand || interaction instanceof UserContextMenu || interaction instanceof MessageContextMenu))
			throw new TypeError(
				"registerInteraction(): interaction parameter must be an instance of InteractionCommand, UserContextMenu, MessageContextMenu."
			);
		if (this.interactions.find((c) => c.name === interaction.name))
			throw new Error(`Interaction ${interaction.name} cannot be registered twice.`);
		if (!interaction.name) throw new Error("InteractionRunnable: name is required.");
		if (interaction instanceof InteractionCommand) if (!interaction.description) throw new Error("InteractionCommand: description is required.");
		this.interactions.push(interaction);
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
			const applicationCommand = this.interactions.find((i) => i.name === interaction.commandName.toLowerCase() && i.type === "CHAT_INPUT");
			if (!applicationCommand) return;

			const isCorrectInstance =
				applicationCommand instanceof InteractionCommand ||
				applicationCommand instanceof UserContextMenu ||
				applicationCommand instanceof MessageContextMenu;

			if (!isCorrectInstance) {
				throw new ExecutionError("Attempting to run non-interaction class with runInteraction().", "INVALID_CLASS");
			}

			const failedReason: ExecutionError | undefined = await Verificators.verifyInteraction(interaction, applicationCommand);
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
				this.interactions.find((i) => i.name === interaction.commandName.toLowerCase() && i.type === "USER") ||
				this.interactions.find((i) => i.name === interaction.commandName.toLowerCase() && i.type === "MESSAGE");

			if (!contextMenuInt) return;

			if (interaction.targetType === "USER" && contextMenuInt.type !== "USER") return;
			if (interaction.targetType === "MESSAGE" && contextMenuInt.type !== "MESSAGE") return;

			const failedReason: ExecutionError | undefined = await Verificators.verifyInteraction(interaction, contextMenuInt);
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
	 * @returns Promise<boolean>
	 *
	 * @param {boolean} [force=false] Skip checks and set commands even if the local version is up to date.
	 * */
	public async updateInteractions(force: boolean = false): Promise<boolean> {
		return new Promise(async (res, rej) => {
			if (!this.client.application)
				return rej(
					new Error(
						"updateInteractions(): client.application is undefined. Make sure you are executing updateInteractions() after the client has emitted the 'ready' event."
					)
				);

			let changesMade = false;
			if (force) {
				// Forcing update, automatically assume changes were made
				this.debug("Skipping checks and updating interactions.");
				changesMade = true;
			} else {
				// Fetch existing interactions and compare to loaded
				this.debug("Checking for differences.");

				const fetchedInteractions = await this.client.application.commands.fetch().catch((err) => {
					return rej(
						new Error(
							`Can't fetch client commands: ${err.message}.\nMake sure you are executing updateInteractions() after the client has emitted the 'ready' event and 'this.client.application' is populated.`
						)
					);
				});
				if (!fetchedInteractions) return rej(new Error("Interactions weren't fetched."));
				changesMade = this.checkDiff(fetchedInteractions);
			}

			if (changesMade) {
				// Filter out message components
				const interactions = this.interactions.filter((r) => ["CHAT_INPUT", "USER", "MESSAGE"].includes(r.type));
				// @ts-ignore
				this.formatAndSend(interactions).then(res).catch(rej);
			} else {
				this.debug("No changes in interactions - not refreshing.");
				res(false); // Result with false (no changes)
			}
		});
	}

	formatAndSend(interactions: any[]) {
		return new Promise(async (res, rej) => {
			let interactionsToSend: any[] = [];
			interactions.forEach((interaction) => {
				if (interaction.type === "CHAT_INPUT" && interaction instanceof InteractionCommand) {
					const data = {
						type: 1,
						application_id: this.client.application!.id,
						name: interaction.name,
						description: interaction.description,
						options: interaction.options,
						default_member_permissions: "0",
					};
					if (interaction.defaultPermissions) {
						data.default_member_permissions = interaction.defaultPermissions
							// @ts-ignore
							.map((e: string) => PERMISSION_FLAGS[e] ?? 0x0)
							.reduce((a, b) => a | b, BigInt(0x0))
							.toString();
					}
					interactionsToSend.push(data);
				} else if (interaction.type === 2 && interaction instanceof UserContextMenu) {
					interactionsToSend.push({ type: "USER", name: interaction.name });
				} else if (interaction.type === "MESSAGE" && interaction instanceof MessageContextMenu) {
					interactionsToSend.push({ type: 3, name: interaction.name });
				} else {
					this.debug(`Interaction type ${interaction.type} is not supported.`);
				}
			});
			await this.client
				.application!.commands // @ts-ignore
				.set(interactions)
				.then((returned) => {
					this.debug(
						`Updated interactions (${returned.size} returned). Wait a bit (up to 1 hour) for the cache to update or kick and add the bot back to see changes.`
					);
					res(true); // Result with true (updated)
				})
				.catch((err) => {
					return rej(new Error(`Can't update client commands: ${err}`));
				});
			// axios(`https://discord.com/api/v10/applications/${this.client.application!.id}/commands`, {
			// 	method: "PUT",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 		Authorization: `Bot ${this.client.token}`,
			// 	},
			// 	data: interactionsToSend,
			// })
			// 	.then((response) => {
			// 		console.log("Returned", response.data);
			// 		this.debug(
			// 			`Updated interactions (${response.data.length} returned). Wait a bit (up to 1 hour) for the cache to update or kick and add the bot back to see changes.`
			// 		);
			// 		res(true); // Result with true (updated)
			// 	})
			// 	.catch((err) => {
			// 		return rej(new Error(`Can't update client commands: ${err}`));
			// 	});
		});
	}

	/**
	 * @ignore
	 * */
	private checkDiff(interactions: Collection<Snowflake, ApplicationCommand>) {
		const fetched = Array.from(interactions.values()); // Collection to array conversion
		// Assume no changes made
		let changesMade = false;
		for (let localCmd of this.interactions) {
			const remoteCmd = fetched.find((f) => f.name === localCmd.name);
			if (!remoteCmd) {
				// Handle created commands
				this.debug("Interactions match check failed because there are new files created in the filesystem. Updating...");
				changesMade = true;
				break;
			}
			// Handle changed commands
			// @ts-ignore Fine to ignore since we are only comparing a select amount of properties
			changesMade = !remoteCmd.equals(localCmd);
		}
		// Handle deleted commands
		for (let remoteCmd of fetched) {
			if (!this.interactions.find((i) => i.name === remoteCmd.name)) {
				this.debug("Interactions match check failed because local interaction files are missing from the filesystem. Updating...");
				changesMade = true;
				break;
			}
		}
		return changesMade;
	}
}
