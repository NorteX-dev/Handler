import { Client, Interaction, InteractionType } from "discord.js";
import { BaseHandler } from "./BaseHandler";
import { Component } from "../structures/Component";
import { QueryingMode } from "../decorators/components/CustomID";

interface HandlerOptions {
	client: Client;
	directory?: string;
	autoLoad?: boolean;
}

export class ComponentHandler extends BaseHandler {
	public client: Client;
	public directory?: string;
	public components: Component[];

	constructor(options: HandlerOptions) {
		super(options);
		if (!options.client) throw new ReferenceError("ComponentHandler(): options.client is required.");
		this.client = options.client;
		this.components = [];
		if (options.autoLoad === undefined || options.autoLoad === false) this.loadComponents();
		return this;
	}

	loadComponents() {
		return new Promise(async (res, rej) => {
			const files = await this.load().catch(rej);
			files.forEach((components: Component) => this.registerComponent(components));
			return res(this.components);
		});
	}

	registerComponent(component: Component): void {
		if (!(component instanceof Component)) return;
		if (this.components.find((c) => c.customId === component.customId))
			throw new Error(`Component '${component.customId}' cannot be registered twice.`);

		// Verify & define defaults for optional fields
		if (!component.customId) {
			throw new Error(
				"registerComponent(): Can't register component that does not have a customId. Define the custom id with the @CustomID decorator."
			);
		}
		if (!component.queryingMode) component.queryingMode = QueryingMode.Exact;
		// Define handler and client properties on class
		Object.defineProperty(component, "handler", { value: this });
		Object.defineProperty(component, "client", { value: this.client });

		this.components.push(component);
		this.debug(`Loaded message component "${component.customId}".`);
		this.emit("load", component);
		return;
	}

	runComponent(interaction: Interaction, ...additionalOptions: any): Promise<Component> {
		return new Promise<Component>((res, rej) => {
			if (interaction.user.bot) return rej("Bot users can't run component interactions.");
			if ([InteractionType.MessageComponent, InteractionType.ModalSubmit].includes(interaction.type)) {
				this.handleComponent(interaction, ...additionalOptions)
					.then(res)
					.catch(rej);
			} else {
				throw new Error(
					"ComponentHandler#runComponent(): Unsupported interaction type. This only supports components and modal submits. You should check the type beforehand, or refer to CommandHandler() to handle commands & context menus."
				);
			}
		});
	}

	private handleComponent(interaction: any, ...additionalOptions: any): Promise<Component> {
		return new Promise<Component>(async (resolve, reject) => {
			const componentInteraction = this.components.find((componentObject) => {
				if (componentObject.queryingMode === QueryingMode.Exact) return componentObject.customId === interaction.customId;
				if (componentObject.queryingMode === QueryingMode.Includes) return interaction.customId.includes(componentObject.customId);
				if (componentObject.queryingMode === QueryingMode.StartsWith) return interaction.customId.startsWith(componentObject.customId);
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
