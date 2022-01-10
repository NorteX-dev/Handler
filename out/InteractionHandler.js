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
const discord_js_1 = require("discord.js");
const events_1 = require("events");
const LocalUtils_1 = require("./LocalUtils");
const glob_1 = require("glob");
const path = require("path");
const InteractionDirectoryReferenceError_1 = require("./errors/InteractionDirectoryReferenceError");
const index_1 = require("./index");
class InteractionHandler extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (!options.client)
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        this.client = options.client;
        this.directory = options.directory;
        this.owners = options.owners || [];
        this.disableInteractionModification = options.disableInteractionModification || false;
        this.forceInteractionUpdate = options.forceInteractionUpdate || false;
        this.interactions = new Map();
        this.localUtils = new LocalUtils_1.LocalUtils(this, this.client, this.owners);
        this.setupInteractionEvent();
        if (options.autoLoad !== false)
            this.loadInteractions();
        if (!this.client) {
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        }
        this.client.on("ready", () => __awaiter(this, void 0, void 0, function* () {
            this.emit("debug", `Client.application assigned.`);
            this.application = this.client.application;
        }));
        return this;
    }
    /*
     * Sets directory for commands
     *
     * @param commandDir Directory to look for while loading commands
     * @returns CommandHandler
     *
     * @remarks
     * This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     * */
    setInteractionsDirectory(absolutePath) {
        if (!absolutePath)
            throw new InteractionDirectoryReferenceError_1.default("absolutePath parameter is required.");
        this.directory = absolutePath;
        return this;
    }
    /*
     * Loads classic message commands into memory
     *
     * @returns CommandHandler
     *
     * @remarks
     * Requires @see {CommandHandler.setCommandDirectory} to be executed first, or commandDirectory to be specified in the CommandHandler constructor.
     * */
    loadInteractions() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!this.directory)
                return reject(new InteractionDirectoryReferenceError_1.default("Interactions directory is not set. Use setInteractionsDirectory(path) prior."));
            const dirPattern = this.directory.endsWith("/") ? this.directory + "**\\*.js" : this.directory + "\\**\\*.js";
            console.log(dirPattern);
            (0, glob_1.glob)(dirPattern, (err, files) => __awaiter(this, void 0, void 0, function* () {
                this.emit("debug", `Found ${files.length} interaction files.`);
                if (err)
                    return reject(new InteractionDirectoryReferenceError_1.default("Supplied interactions directory is invalid. Please ensure it exists and is absolute."));
                const duplicates = [];
                for (const file of files) {
                    const parsedPath = path.parse(file);
                    // Require command class
                    let InteractionFile;
                    InteractionFile = require(file);
                    if (!InteractionFile)
                        return this.emit("dubug", `${parsedPath} failed to load.`);
                    // Check if is class
                    console.log(InteractionFile);
                    if (!this.localUtils.isClass(InteractionFile))
                        throw new TypeError(`Interaction ${parsedPath.name} doesn't export any of the correct classes.`);
                    // Initialize command class
                    const interaction = new InteractionFile(this, this.client, parsedPath.name.toLowerCase());
                    // Check if initialized class is extending Command
                    if (!(interaction instanceof index_1.CommandInteraction || interaction instanceof index_1.UserContextMenuInteraction || interaction instanceof index_1.MessageContextMenuInteraction))
                        throw new TypeError(`Interaction file: ${parsedPath.name} doesn't extend one of the valid the interaction classes: CommandInteraction, UserContextMenuInteraction, MessageContextMenuInteraction.`);
                    // Save command to map
                    if (this.interactions.get(interaction.type + "_" + interaction.name)) {
                        duplicates.push(interaction);
                        continue;
                    }
                    this.interactions.set(interaction.type + "_" + interaction.name, interaction);
                    this.emit("debug", `Loaded interaction "${interaction.name}" from file "${parsedPath.base}"`);
                    this.emit("load", interaction);
                }
                if (duplicates === null || duplicates === void 0 ? void 0 : duplicates.length)
                    throw new Error(`Loading interaction with the same name: ${duplicates.map((d) => d.name).join(", ")}.`);
                if (!this.disableInteractionModification)
                    this.client.on("ready", () => __awaiter(this, void 0, void 0, function* () {
                        yield this.postInteractions(this.forceInteractionUpdate);
                    }));
                this.emit("ready");
                resolve(this.interactions);
            }));
        }));
    }
    setupInteractionEvent() {
        this.client.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (interaction.user.bot)
                return;
            if (interaction.isCommand())
                this.handleCommandInteraction(interaction);
            if (interaction.isContextMenu())
                this.handleContextMenuInteraction(interaction);
        }));
    }
    handleCommandInteraction(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const slashCommand = this.interactions.get("CHAT_INPUT_" + interaction.commandName.toLowerCase());
            if (!slashCommand)
                return;
            const failedReason = yield this.localUtils.verifyInteraction(interaction);
            if (failedReason) {
                this.emit("error", failedReason, interaction);
                return;
            }
            try {
                yield slashCommand.run(interaction);
            }
            catch (ex) {
                console.error(ex);
                this.emit("error", ex, interaction);
            }
        });
    }
    handleContextMenuInteraction(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const contextMenuInt = this.interactions.get("USER_" + interaction.commandName.toLowerCase()) || this.interactions.get("MESSAGE_" + interaction.commandName.toLowerCase());
            if (!contextMenuInt)
                return;
            // @ts-ignore
            if (interaction.targetType === "USER" && contextMenuInt.type !== "USER")
                return;
            // @ts-ignore
            if (interaction.targetType === "MESSAGE" && contextMenuInt.type !== "MESSAGE")
                return;
            const failedReason = yield this.localUtils.verifyInteraction(interaction);
            if (failedReason)
                return this.emit("error", failedReason, interaction);
            try {
                yield contextMenuInt.run(interaction);
            }
            catch (ex) {
                console.error(ex);
                this.emit("error", ex, interaction);
            }
        });
    }
    postInteractions(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let changes;
            if (!force) {
                const fetchedInteractions = yield this.application.commands.fetch().catch((err) => {
                    throw new Error(`Can't fetch client commands: ${err}`);
                });
                if (!fetchedInteractions)
                    throw new TypeError("Interactions weren't fetched.");
                changes = yield this.didChange(fetchedInteractions);
            }
            if (changes || force) {
                this.emit("debug", "Changes in interaction files detected - re-creating the interactions. Please wait.");
                const formed = Array.from(this.interactions, ([_, data]) => {
                    if (data.type === "CHAT_INPUT") {
                        // @ts-ignore
                        return { name: data.name, description: data.description, defaultPermission: data.defaultPermission, options: data.options, type: data.type };
                    }
                    if (data.type === "USER")
                        return { name: data.name, type: data.type };
                    if (data.type === "MESSAGE")
                        return { name: data.name, type: data.type };
                });
                // await this.application!.commands.set([]).then((r) => this.emit("debug", "Cleaned out old commands"));
                // @ts-ignore
                yield this.application.commands.set(formed).then((r) => this.emit("debug", "Created all commands (" + r.size + " returned)"));
                this.emit("debug", "Interaction changes were posted successfully. Remember to wait a bit (up to 1 hour) or kick and add the bot back to see changes.");
            }
            else
                this.emit("debug", "No changes in interactions - not refreshing.");
        });
    }
    didChange(interactions) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetched = Array.from(interactions, ([_, data]) => data);
            const existing = Array.from(this.interactions, ([_, data]) => data);
            for (let localCmd of existing) {
                const remoteCmd = fetched.find((cmd) => cmd.name === localCmd.name);
                if (!remoteCmd)
                    return true;
                const oldOptions = remoteCmd.options;
                const modifiedRemoteCmd = remoteCmd;
                delete modifiedRemoteCmd.options;
                delete modifiedRemoteCmd.version;
                delete modifiedRemoteCmd.guild;
                delete modifiedRemoteCmd.id;
                delete modifiedRemoteCmd.applicationId;
                const modifiedLocalCmd = {
                    name: localCmd.name,
                    type: localCmd.type,
                };
                const equals = modifiedRemoteCmd.equals(modifiedLocalCmd);
                if (localCmd.type === "COMMAND") {
                    // @ts-ignore
                    modifiedLocalCmd.description = localCmd.description;
                    // @ts-ignore
                    modifiedLocalCmd.defaultPermission = localCmd.defaultPermission;
                    if (!remoteCmd.options)
                        remoteCmd.options = [];
                    // @ts-ignore
                    if (!localCmd.options)
                        localCmd.options = [];
                    // @ts-ignore
                    const optionsEqual = discord_js_1.ApplicationCommand.optionsEqual(oldOptions, localCmd.options);
                    if (!equals || !optionsEqual)
                        return true;
                }
                // @ts-ignore
                if (!equals)
                    return true;
            }
            for (let remoteCmd of fetched) {
                if (!existing.find((c) => c.name === remoteCmd.name)) {
                    this.emit("debug", "Refreshing interactions because interaction files have been deleted.");
                    return true;
                }
            }
            return false;
        });
    }
}
exports.InteractionHandler = InteractionHandler;
