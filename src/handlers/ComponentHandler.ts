import { Client, Interaction as DJSInteraction, InteractionType } from "discord.js";
import BaseHandler from "./BaseHandler";
import Component from "../structures/Component";

interface HandlerOptions {
	client: Client;
	directory?: string;
	autoLoad?: boolean;
}

export default class ComponentHandler extends BaseHandler {
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
	public components: Component[];

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("ComponentHandler(): options.client is required.");
		this.client = options.client;
		this.components = [];
		if (options.autoLoad === undefined || options.autoLoad === false) this.loadComponents();
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
		return new Promise(async (res, rej) => {
			const files = await this.load().catch(rej);
			files.forEach((components: Component) => this.registerComponent(components));
			return res(this.components);
		});
	}

	/**
	 * Manually register an instanced component interaction. This should not be needed when using loadComponents().
	 *
	 * @returns Interaction
	 * */
	registerComponent(component: Component) {
		if (!(component instanceof Component)) throw new TypeError("registerComponent(): interaction parameter must be an instance of Component.");
		if (this.components.find((c) => c.customId === component.customId))
			throw new Error(`Component '${component.customId}' cannot be registered twice.`);
		this.components.push(component);
		this.debug(`Loaded message component "${component.customId}".`);
		this.emit("load", component);
		return component;
	}

	/**
	 * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
	 *
	 * @returns Promise<Component>
	 *
	 * */
	runComponent(interaction: DJSInteraction, ...additionalOptions: any) {
		return new Promise<Component>((res, rej) => {
			if (interaction.user.bot) return rej("Bot users can't run component interactions.");
			if (interaction.type === InteractionType.MessageComponent || interaction.type === InteractionType.ModalSubmit) {
				this.handleComponentOrMS(interaction, ...additionalOptions)
					.then(res)
					.catch(rej);
			} else {
				throw new Error(
					"ComponentHandler#runComponent(): Unsupported interaction type. This only supports components. You should check the type beforehand, or refer to CommandsHandler() to handle commands & context menus."
				);
			}
		});
	}

	private handleComponentOrMS(interaction: any, ...additionalOptions: any) {
		return new Promise<Component>(async (resolve, reject) => {
			const componentInteraction = this.components.find((componentObject) => {
				if (componentObject.queryingMode === "exact") return componentObject.customId === interaction.customId;
				if (componentObject.queryingMode === "includes") return interaction.customId.includes(componentObject.customId);
				if (componentObject.queryingMode === "startsWith") return interaction.customId.startsWith(componentObject.customId);
				return false;
			});

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
