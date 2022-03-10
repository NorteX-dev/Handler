import { Client, Interaction as DJSInteraction } from "discord.js";
import { Handler } from "./Handler";
import { ComponentInteraction } from "../index";
import ComponentsStore from "../store/ComponentsStore";

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
	public components: ComponentsStore;

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("ComponentHandler(): options.client is required.");
		this.client = options.client;
		this.directory = options.directory ? options.directory : undefined;
		this.components = new ComponentsStore();
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
			const files = await this.loadAndInstance().catch(rej);
			files.forEach((components: ComponentInteraction) => this.registerComponent(components));
			return res(this.components);
		});
	}

	/**
	 * Manually register an instanced component interaction. This should not be needed when using loadComponents().
	 *
	 * @returns Interaction
	 * */
	//
	registerComponent(component: ComponentInteraction) {
		if (!(component instanceof ComponentInteraction))
			throw new TypeError(
				"registerInteraction(): interaction parameter must be an instance of InteractionCommand, UserContextMenu, MessageContextMenu."
			);
		if (this.components.getByCid(component.customId)) throw new Error(`Component '${component.name}' cannot be registered twice.`);
		this.components.add(component);
		this.debug(`Loaded interaction "${component.name}".`);
		this.emit("load", component);
		return component;
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
			const componentInteraction = this.components.find((componentObject) => {
				if (componentObject.queryingMode === "exact") return componentObject.customId === interaction.customId;
				if (componentObject.queryingMode === "includes") return interaction.customId.includes(componentObject.customId);
				if (componentObject.queryingMode === "startsWith") return interaction.customId.startsWith(componentObject.customId);
				return false;
			});

			if (!componentInteraction) return;

			this.debug(`Found matching interaction with the queryingMode ${componentInteraction.queryingMode}: ${componentInteraction.customId}`);
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