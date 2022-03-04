import { Client, ClientApplication, Interaction as DJSInteraction } from "discord.js";
import { LocalUtils } from "../util/LocalUtils";
import { Handler } from "./Handler";
import { glob } from "glob";
import * as path from "path";

import DirectoryReferenceError from "../errors/DirectoryReferenceError";
import { ComponentInteraction, InteractionCommand, MessageContextMenu, UserContextMenu } from "../index";

interface HandlerOptions {
	client: Client;
	directory?: string;
	autoLoad?: boolean;
}

export class ComponentHandler extends Handler {
	/**
	 * Initializes an component interaction handler on the client.
	 *
	 * @param options Component handler options
	 * @param options.client Discord.JS Client Instance
	 * @param options.directory Optional - Component interaction files directory
	 * @param options.autoLoad Optional - Automatically invoke the loadInteractions() method - requires `directory` to be set in the options
	 * @returns ComponentHandler
	 * */
	public client: Client;
	public directory?: string;
	public owners?: Array<string>;

	public components: Map<string, InteractionCommand | UserContextMenu | MessageContextMenu>;
	private localUtils: LocalUtils;

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("ComponentHandler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory ? path.join(process.cwd(), options.directory) : undefined;
		this.components = new Map();
		this.localUtils = new LocalUtils();
		if (options.autoLoad === undefined || !options.autoLoad) this.loadComponents();
		return this;
	}

	/**
	 * Loads component interactions into memory
	 *
	 * @returns ComponentHandler
	 *
	 * @remarks
	 * Requires @see {@link InteractionHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
	 * Run {@link ComponentHandler.runComponent()} to be invoked to run the ocmmand on an event.
	 * */
	loadComponents() {
		return new Promise(async (resolve, reject) => {
			if (!this.directory) return reject(new DirectoryReferenceError("Components directory is not set. Use setDirectory(path) prior."));
			glob(this.directory + "/**/*.js", {}, async (err: Error | null, files: string[]) => {
				if (err) throw err;
				this.emit("debug", `Found ${files.length} component files.`);
				if (err) return reject(new DirectoryReferenceError("Supplied components directory is invalid. Please ensure it exists and is absolute."));
				for (const file of files) {
					const parsedPath = path.parse(file);
					// Require command class
					const InteractionFile = require(file);
					if (!InteractionFile) return this.emit("dubug", `${parsedPath} failed to load.`);
					// Check if is class
					if (!this.localUtils.isClass(InteractionFile)) throw new TypeError(`Interaction ${parsedPath.name} doesn't export any of the correct classes.`);
					// Initialize command class
					const component = new InteractionFile(this, this.client, parsedPath.name.toLowerCase());
					// Check if initialized class is extending Command
					if (!(component instanceof ComponentInteraction))
						throw new TypeError(`Component file: ${parsedPath.name} doesn't extend ComponentInteraction. Use InteractionHandler to handle interactions like commands and context menus.`);
					// Save command to map
					// @ts-ignore - Fine to ignore since it's never going to be verified
					this.components.set(component.name, component);
					this.emit("debug", `Loaded component "${component.name}" from file "${parsedPath.base}".`);
					this.emit("load", component);
				}
				this.emit("ready");
				resolve(this.components);
			});
		});
	}

	/**
	 * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
	 *
	 * @returns Promise<Interaction>
	 *
	 * */
	runComponent(interaction: DJSInteraction, ...additionalOptions: any) {
		return new Promise((res, rej) => {
			if (interaction.user.bot) return rej("Bot users can't run component interactions.");
			if (!(interaction.isCommand() || interaction.isContextMenu())) {
				this.handleComponent(interaction, ...additionalOptions)
					.then(res)
					.catch(rej);
			} else {
				throw new Error(
					"ComponentHandler#runComponent(): Unsupported interaction type. This only supports components. You should check the type beforehand, or refer to InteractionHandler() to handle commands & context menus."
				);
			}
		});
	}

	private handleComponent(interaction: any, ...additionalOptions: any) {
		return new Promise(async (resolve, reject) => {
			const componentInteraction = this.components.get(interaction.customId.toLowerCase());
			if (!componentInteraction) return;

			try {
				componentInteraction.run(interaction, ...additionalOptions);
				resolve(componentInteraction);
			} catch (ex) {
				console.error(ex);
				reject(ex);
			}
		});
	}
}
