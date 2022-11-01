import { ApplicationCommand, ApplicationCommandType, Client, Collection, CommandInteraction, InteractionType, Snowflake } from "discord.js";
import { BaseHandler } from "./BaseHandler";
import { ExecutionError } from "../errors/ExecutionError";
import Verificators from "../util/Verificators";
import { Command } from "../structures/Command";

interface HandlerOptions {
	client: Client;
	directory?: string;
	autoLoad?: boolean;
}

export class CommandHandler extends BaseHandler {
	public client: Client;
	public commands: Command[];
	public directory?: string;

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("CommandHandler(): options.client is required.");
		this.client = options.client;
		this.commands = [];
		if (options.autoLoad === undefined || options.autoLoad === false) this.loadCommands();
		return this;
	}

	loadCommands() {
		return new Promise(async (res, rej) => {
			const files = await this.load(false /*emitReady*/).catch(rej);
			files.forEach((cmd: Command) => this.registerCommand(cmd));
			return res(this.commands);
		});
	}

	registerCommand(cmd: Command) {
		if (!(cmd instanceof Command)) throw new TypeError("registerInteraction(): cmd parameter must be an instance of Command.");
		if (this.commands.find((c) => c.name === cmd.name)) throw new Error(`Command ${cmd.name} cannot be registered twice.`);

		// Verify & define defaults for optional fields
		if (!cmd.name) {
			throw new Error("registerCommand(): Can't register command that does not have a name. Define the command name with the @Name decorator.");
		}
		if (!cmd.description) {
			throw new Error(
				"registerCommand(): Can't register command that does not have a description. Define the command description with the @Description decorator."
			);
		}
		if (!cmd.options) cmd.options = [];
		if (!cmd.defaultPermissions) cmd.defaultPermissions = [];
		if (!cmd.disabled) cmd.disabled = false;
		// Define handler and client properties on class
		Object.defineProperty(cmd, "handler", { value: this });
		Object.defineProperty(cmd, "client", { value: this.client });

		this.commands.push(cmd);
		this.debug(`Loaded command "${cmd.name}".`);
		this.emit("load", cmd);
		return cmd;
	}

	runCommand(interaction: CommandInteraction, ...additionalOptions: any) {
		return new Promise((res, rej) => {
			if (interaction.user.bot) return rej("Bot users can't run interactions.");
			if (interaction.type === InteractionType.ApplicationCommand) {
				this.handleCommandRun(interaction, ...additionalOptions)
					.then(res)
					.catch(rej);
			} else {
				throw new Error(
					"CommandHandler#runCommand(): Unsupported interaction type. This only supports commands. You should check the type beforehand, or refer to ComponentHandler() to handle component interactions."
				);
			}
		});
	}

	public async updateInteractions(force: boolean = false): Promise<boolean> {
		return new Promise<boolean>(async (res, rej) => {
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
				this.formatAndSend(this.commands).then(res).catch(rej);
			} else {
				this.debug("No changes in interactions - not refreshing.");
				res(false); // Result with false (no changes)
			}
		});
	}

	formatAndSend(commands: Command[]) {
		return new Promise<boolean>(async (res, rej) => {
			let interactionsToSend: any[] = [];
			commands.forEach((cmd: Command) => {
				if (!(cmd instanceof Command)) return this.debug(`Skipping ${JSON.stringify(cmd)} - class does not extend Command.`);
				const data = {
					type: ApplicationCommandType.ChatInput,
					application_id: this.client.application!.id,
					name: cmd.name,
					description: cmd.description,
					options: cmd.options,
					default_member_permissions: "0",
				};
				interactionsToSend.push(data);
			});
			await this.client
				.application!.commands.set(interactionsToSend)
				.then((returned) => {
					this.debug(`Updated interactions (${returned.size} returned). Updates should be visible momentarily.`);
					res(true); // Result with true (updated)
				})
				.catch((err) => {
					return rej(new Error(`Can't update client commands: ${err}`));
				});
		});
	}

	private handleCommandRun(interaction: CommandInteraction, ...additionalOptions: any) {
		return new Promise(async (res, rej) => {
			const cmd = this.commands.find((i) => i.name === interaction.commandName.toLowerCase());
			if (!cmd) return;

			if (!(cmd instanceof Command)) {
				throw new ExecutionError("Attempting to run non-command class with runCommand().", "INVALID_CLASS");
			}

			const failedReason: ExecutionError | undefined = await Verificators.verifyCommand(interaction, cmd);
			if (failedReason) {
				rej(failedReason);
				return;
			}

			try {
				cmd.run(interaction, ...additionalOptions);
				res(cmd);
			} catch (ex) {
				console.error(ex);
				rej(ex);
			}
		});
	}

	private checkDiff(interactions: Collection<Snowflake, ApplicationCommand>) {
		const fetched = Array.from(interactions.values()); // Collection to array conversion
		// Assume no changes made
		let changesMade = false;
		for (let localCmd of this.commands) {
			const remoteCmd = fetched.find((f) => f.name === localCmd.name);
			// @ts-ignore
			changesMade = !remoteCmd.equals(localCmd.toJSON());
		}
		return changesMade;
	}
}
