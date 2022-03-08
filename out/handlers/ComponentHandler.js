"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentHandler = void 0;
const Handler_1 = require("./Handler");
const path = require("path");
const index_1 = require("../index");
class ComponentHandler extends Handler_1.Handler {
    constructor(options) {
        super(options);
        if (!options.client)
            throw new ReferenceError("ComponentHandler(): options.client is required.");
        this.client = options.client;
        this.directory = options.directory ? path.join(process.cwd(), options.directory) : undefined;
        this.components = new Map();
        if (options.autoLoad === undefined)
            this.loadComponents();
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
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const files = yield this.loadAndInstance().catch(rej);
            files.forEach((components) => this.registerComponent(components));
            return res(this.components);
        }));
    }
    /**
     * Manually register an instanced component interaction. This should not be needed when using loadComponents().
     *
     * @returns Interaction
     * */
    //
    registerComponent(component) {
        if (!(component instanceof index_1.ComponentInteraction))
            throw new TypeError("registerInteraction(): interaction parameter must be an instance of InteractionCommand, UserContextMenu, MessageContextMenu.");
        if (this.components.get(component.customId))
            throw new Error(`Component ${component.name} cannot be registered twice.`);
        this.components.set(component.customId, component);
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
    runComponent(interaction, ...additionalOptions) {
        return new Promise((res, rej) => {
            if (interaction.user.bot)
                return rej("Bot users can't run component interactions.");
            if (!(interaction.isCommand() || interaction.isContextMenu())) {
                this.handleComponent(interaction, ...additionalOptions)
                    .then(res)
                    .catch(rej);
            }
            else {
                throw new Error("ComponentHandler#runComponent(): Unsupported interaction type. This only supports components. You should check the type beforehand, or refer to InteractionHandler() to handle commands & context menus.");
            }
        });
    }
    handleComponent(interaction, ...additionalOptions) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const componentsArray = Array.from(this.components.values());
            const componentInteraction = componentsArray.find((componentObject) => {
                if (componentObject.queryingMode === "exact")
                    return componentObject.customId === interaction.customId;
                if (componentObject.queryingMode === "includes")
                    return interaction.customId.includes(componentObject.customId);
                if (componentObject.queryingMode === "startsWith")
                    return interaction.customId.startsWith(componentObject.customId);
                return false;
            });
            if (!componentInteraction)
                return;
            this.debug("Found matching interaction with the queryingMode " + componentInteraction.queryingMode + ": " + componentInteraction.customId);
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
        }));
    }
}
exports.ComponentHandler = ComponentHandler;
//# sourceMappingURL=ComponentHandler.js.map