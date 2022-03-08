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
exports.InteractionHandler = void 0;
const Handler_1 = require("./Handler");
const index_1 = require("../index");
class InteractionHandler extends Handler_1.Handler {
    constructor(options) {
        var _a;
        super(options);
        if (!options.client)
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        this.client = options.client;
        this.directory = (_a = options.directory) !== null && _a !== void 0 ? _a : undefined;
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
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const files = yield this.loadAndInstance(false).catch(rej);
            files.forEach((interaction) => this.registerInteraction(interaction));
            return res(this.interactions);
        }));
    }
    /**
     * Manually register an instanced interaction. This should not be needed when using loadInteractions().
     *
     * @returns Interaction
     * */
    registerInteraction(interaction) {
        if (!(interaction instanceof index_1.InteractionCommand || interaction instanceof index_1.UserContextMenu || interaction instanceof index_1.MessageContextMenu))
            throw new TypeError("registerInteraction(): interaction parameter must be an instance of InteractionCommand, UserContextMenu, MessageContextMenu.");
        if (this.interactions.get(interaction.name))
            throw new Error(`Interaction ${interaction.name} cannot be registered twice.`);
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
    runInteraction(interaction, ...additionalOptions) {
        return new Promise((res, rej) => {
            if (interaction.user.bot)
                return rej("Bot users can't run interactions.");
            if (interaction.isCommand()) {
                this.handleCommandInteraction(interaction, ...additionalOptions)
                    .then(res)
                    .catch(rej);
            }
            else if (interaction.isContextMenu()) {
                this.handleContextMenuInteraction(interaction, ...additionalOptions)
                    .then(res)
                    .catch(rej);
            }
            else {
                throw new Error("InteractionHandler#runInteraction(): Unsupported interaction type. This only supports command and context menus interactions. You should check the type beforehand, or refer to ComponentHandler() to handle components.");
            }
        });
    }
    /**
     * @ignore
     * */
    handleCommandInteraction(interaction, ...additionalOptions) {
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const applicationCommand = this.interactions.get("CHAT_INPUT_" + interaction.commandName.toLowerCase());
            if (!applicationCommand)
                return;
            const failedReason = yield this.localUtils.verifyInteraction(interaction, applicationCommand);
            if (failedReason) {
                rej(failedReason);
                return;
            }
            try {
                applicationCommand.run(interaction, ...additionalOptions);
                res(applicationCommand);
            }
            catch (ex) {
                console.error(ex);
                rej(ex);
            }
        }));
    }
    /**
     * @ignore
     * */
    handleContextMenuInteraction(interaction, ...additionalOptions) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const contextMenuInt = this.interactions.get("USER_" + interaction.commandName.toLowerCase()) ||
                this.interactions.get("MESSAGE_" + interaction.commandName.toLowerCase());
            if (!contextMenuInt)
                return;
            if (interaction.targetType === "USER" && contextMenuInt.type !== "USER")
                return;
            if (interaction.targetType === "MESSAGE" && contextMenuInt.type !== "MESSAGE")
                return;
            const failedReason = yield this.localUtils.verifyInteraction(interaction, contextMenuInt);
            if (failedReason) {
                reject(failedReason);
                return;
            }
            try {
                contextMenuInt.run(interaction, ...additionalOptions);
                resolve(contextMenuInt);
            }
            catch (ex) {
                console.error(ex);
                reject(ex);
            }
        }));
    }
    /**
     * Compare the local version of the interactions to the ones in Discord API and update if needed.
     *
     * @returns Interaction
     *
     * @param {boolean} [force=false] Skip checks and set commands even if the local version is up to date.
     * */
    updateInteractions(force = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let changesMade = false;
            if (force) {
                // Forcing update, automatically assume changes were made
                this.debug("Skipping checks and updating interactions.");
                changesMade = true;
            }
            else {
                // Fetch existing interactions and compare to loaded
                this.debug("Checking for differences.");
                if (!this.client.application)
                    throw new Error("updateInteractions(): client.application is undefined. Make sure you are executing updateInteractions() after the client has emitted the 'ready' event.");
                const fetchedInteractions = yield this.client.application.commands.fetch().catch((err) => {
                    throw new Error(`Can't fetch client commands: ${err}`);
                });
                if (!fetchedInteractions)
                    throw new Error("Interactions weren't fetched.");
                changesMade = yield this.checkDiff(fetchedInteractions);
            }
            if (changesMade) {
                // Filter out message components
                const interactionsArray = Array.from(this.interactions, ([_key, interaction]) => interaction).filter((r) => ["CHAT_INPUT", "USER", "MESSAGE"].includes(r.type));
                let interactionsToSend = [];
                interactionsArray.forEach((interaction) => {
                    if (interaction.type === "CHAT_INPUT" && interaction instanceof index_1.InteractionCommand) {
                        interactionsToSend.push({
                            type: "CHAT_INPUT",
                            name: interaction.name,
                            description: interaction.description,
                            defaultPermission: interaction.defaultPermission,
                            permissions: interaction.permissions,
                            options: interaction.options,
                        });
                    }
                    else if (interaction.type === "USER" && interaction instanceof index_1.UserContextMenu) {
                        interactionsToSend.push({ type: "USER", name: interaction.name });
                    }
                    else if (interaction.type === "MESSAGE" && interaction instanceof index_1.MessageContextMenu) {
                        interactionsToSend.push({ type: "MESSAGE", name: interaction.name });
                    }
                    else {
                        this.debug(`Interaction type ${interaction.type} is not supported.`);
                    }
                });
                yield ((_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.set(interactionsArray).then((returned) => {
                    this.debug(`Updated interactions (${returned.size} returned). Wait a bit (up to 1 hour) for the cache to update or kick and add the bot back to see changes.`);
                    this.emit("ready");
                }).catch((err) => {
                    throw new Error(`Can't update client commands: ${err}`);
                }));
            }
            else {
                this.debug("No changes in interactions - not refreshing.");
                this.emit("ready");
            }
        });
    }
    /**
     * @ignore
     * */
    checkDiff(interactions) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.InteractionHandler = InteractionHandler;
//# sourceMappingURL=InteractionHandler.js.map