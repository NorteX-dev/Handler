"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentHandler = void 0;
const discord_js_1 = require("discord.js");
const BaseHandler_1 = require("./BaseHandler");
const Component_1 = require("../structures/Component");
const CustomID_1 = require("../decorators/components/CustomID");
class ComponentHandler extends BaseHandler_1.BaseHandler {
    constructor(options) {
        super(options);
        if (!options.client)
            throw new ReferenceError("ComponentHandler(): options.client is required.");
        this.client = options.client;
        this.components = [];
        if (options.autoLoad === undefined || options.autoLoad === false)
            this.loadComponents();
        return this;
    }
    loadComponents() {
        return new Promise(async (res, rej) => {
            const files = await this.load().catch(rej);
            files.forEach((components) => this.registerComponent(components));
            return res(this.components);
        });
    }
    registerComponent(component) {
        if (!(component instanceof Component_1.Component))
            return;
        if (this.components.find((c) => c.customId === component.customId))
            throw new Error(`Component '${component.customId}' cannot be registered twice.`);
        // Verify & define defaults for optional fields
        if (!component.customId) {
            throw new Error("registerComponent(): Can't register component that does not have a customId. Define the custom id with the @CustomID decorator.");
        }
        if (!component.queryingMode)
            component.queryingMode = CustomID_1.QueryingMode.Exact;
        // Define handler and client properties on class
        Object.defineProperty(component, "handler", { value: this });
        Object.defineProperty(component, "client", { value: this.client });
        this.components.push(component);
        this.debug(`Loaded message component "${component.customId}".`);
        this.emit("load", component);
        return;
    }
    runComponent(interaction, ...additionalOptions) {
        return new Promise((res, rej) => {
            if (interaction.user.bot)
                return rej("Bot users can't run component interactions.");
            if ([discord_js_1.InteractionType.MessageComponent, discord_js_1.InteractionType.ModalSubmit].includes(interaction.type)) {
                this.handleComponent(interaction, ...additionalOptions)
                    .then(res)
                    .catch(rej);
            }
            else {
                throw new Error("ComponentHandler#runComponent(): Unsupported interaction type. This only supports components and modal submits. You should check the type beforehand, or refer to CommandHandler() to handle commands & context menus.");
            }
        });
    }
    handleComponent(interaction, ...additionalOptions) {
        return new Promise(async (resolve, reject) => {
            const componentInteraction = this.components.find((componentObject) => {
                if (componentObject.queryingMode === CustomID_1.QueryingMode.Exact)
                    return componentObject.customId === interaction.customId;
                if (componentObject.queryingMode === CustomID_1.QueryingMode.Includes)
                    return interaction.customId.includes(componentObject.customId);
                if (componentObject.queryingMode === CustomID_1.QueryingMode.StartsWith)
                    return interaction.customId.startsWith(componentObject.customId);
                return false;
            });
            if (!componentInteraction)
                return;
            try {
                componentInteraction.run(interaction, ...additionalOptions);
                resolve(componentInteraction);
            }
            catch (ex) {
                console.error(ex);
                reject(ex);
            }
        });
    }
}
exports.ComponentHandler = ComponentHandler;
