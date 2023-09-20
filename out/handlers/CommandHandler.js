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
exports.CommandHandler = void 0;
const discord_js_1 = require("discord.js");
const BaseHandler_1 = require("./BaseHandler");
const ExecutionError_1 = require("../errors/ExecutionError");
const Verificators_1 = require("../util/Verificators");
const Command_1 = require("../structures/Command");
class CommandHandler extends BaseHandler_1.BaseHandler {
    constructor(options) {
        super(options);
        if (!options.client)
            throw new ReferenceError("CommandHandler(): options.client is required.");
        this.client = options.client;
        this.commands = [];
        if (options.autoLoad === undefined || options.autoLoad === false)
            this.loadCommands();
        return this;
    }
    loadCommands() {
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const files = yield this.load(false /*emitReady*/).catch(rej);
            files.forEach((cmd) => this.registerCommand(cmd));
            return res(this.commands);
        }));
    }
    registerCommand(cmd) {
        if (!(cmd instanceof Command_1.Command))
            return;
        if (this.commands.find((c) => c.name === cmd.name))
            throw new Error(`Command ${cmd.name} cannot be registered twice.`);
        // Verify & define defaults for optional fields
        if (!cmd.name) {
            throw new Error("registerCommand(): Can't register command that does not have a name. Define the command name with the @Name decorator.");
        }
        if (!cmd.description) {
            throw new Error("registerCommand(): Can't register command that does not have a description. Define the command description with the @Description decorator.");
        }
        if (!cmd.options)
            cmd.options = [];
        if (!cmd.disabled)
            cmd.disabled = false;
        // Define handler and client properties on class
        Object.defineProperty(cmd, "handler", { value: this });
        Object.defineProperty(cmd, "client", { value: this.client });
        this.commands.push(cmd);
        this.debug(`Loaded command "${cmd.name}".`);
        this.emit("load", cmd);
        return;
    }
    runCommand(interaction /*TODO: temporary typing fix*/, ...additionalOptions) {
        return new Promise((res, rej) => {
            if (interaction.user.bot)
                return rej("Bot users can't run interactions.");
            if (interaction.type === discord_js_1.InteractionType.ApplicationCommand) {
                this.handleCommandRun(interaction, ...additionalOptions)
                    .then(res)
                    .catch(rej);
            }
            else if (interaction.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete) {
                // Polyfill for autocomplete interactions
                this.handleAutocomplete(interaction, ...additionalOptions)
                    .then(res)
                    .catch(rej);
            }
            else {
                throw new Error("CommandHandler#runCommand(): Unsupported interaction type. This only supports commands. You should check the type beforehand, or refer to ComponentHandler() to handle component interactions.");
            }
        });
    }
    updateInteractions(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                if (!this.client.application)
                    return rej(new Error("updateInteractions(): client.application is undefined. Make sure you are executing updateInteractions() after the client has emitted the 'ready' event."));
                let changesMade = false;
                if (force) {
                    // Forcing update, automatically assume changes were made
                    this.debug("Skipping checks and updating interactions.");
                    changesMade = true;
                }
                else {
                    // Fetch existing interactions and compare to loaded
                    this.debug("Checking for differences.");
                    const fetchedInteractions = yield this.client.application.commands.fetch().catch((err) => {
                        return rej(new Error(`Can't fetch client commands: ${err.message}.\nMake sure you are executing updateInteractions() after the client has emitted the 'ready' event and 'this.client.application' is populated.`));
                    });
                    if (!fetchedInteractions)
                        return rej(new Error("Interactions weren't fetched."));
                    changesMade = this.checkDiff(fetchedInteractions);
                }
                if (changesMade) {
                    this.formatAndSend(this.commands).then(res).catch(rej);
                }
                else {
                    this.debug("No changes in interactions - not refreshing.");
                    res(false); // Result with false (no changes)
                }
            }));
        });
    }
    formatAndSend(commands) {
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            let interactionsToSend = [];
            commands.forEach((cmd) => {
                if (!(cmd instanceof Command_1.Command))
                    return this.debug(`Skipping ${JSON.stringify(cmd)} - class does not extend Command.`);
                const data = {
                    type: discord_js_1.ApplicationCommandType.ChatInput,
                    application_id: this.client.application.id,
                    name: cmd.name,
                    description: cmd.description,
                    options: cmd.options,
                    default_member_permissions: cmd.defaultMemberPermissions,
                };
                interactionsToSend.push(data);
            });
            yield this.client
                .application.commands.set(interactionsToSend)
                .then((returned) => {
                this.debug(`Updated interactions (${returned.size} returned). Updates should be visible momentarily.`);
                res(true); // Result with true (updated)
            })
                .catch((err) => {
                return rej(new Error(`Can't update client commands: ${err}`));
            });
        }));
    }
    handleCommandRun(interaction, ...additionalOptions) {
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const cmd = this.commands.find((i) => i.name === interaction.commandName.toLowerCase());
            if (!cmd)
                return;
            if (!(cmd instanceof Command_1.Command)) {
                throw new ExecutionError_1.ExecutionError("Attempting to run non-command class with runCommand().", "INVALID_CLASS");
            }
            const failedReason = yield Verificators_1.default.verifyCommand(interaction, cmd);
            if (failedReason) {
                rej(failedReason);
                return;
            }
            try {
                cmd.run(interaction, ...additionalOptions);
                res(cmd);
            }
            catch (ex) {
                console.error(ex);
                rej(ex);
            }
        }));
    }
    handleAutocomplete(interaction, ...additionalOptions) {
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const cmd = this.commands.find((cmd) => cmd.name === interaction.commandName.toLowerCase());
            if (!cmd)
                return;
            if (!(cmd instanceof Command_1.Command)) {
                throw new ExecutionError_1.ExecutionError("Attempting to call autocomplete on non-command class.", "INVALID_CLASS");
            }
            if (!cmd["autocomplete"])
                return;
            try {
                cmd.autocomplete(interaction, ...additionalOptions);
                res(cmd);
            }
            catch (ex) {
                console.error(ex);
                rej(ex);
            }
        }));
    }
    checkDiff(interactions) {
        const fetched = Array.from(interactions.values()); // Collection to array conversion
        // Assume no changes made
        let changesMade = false;
        for (let localCmd of this.commands) {
            const remoteCmd = fetched.find((f) => f.name === localCmd.name);
            if (!remoteCmd) {
                // Handle created commands
                this.debug("Commands match check failed because there are new files created in the filesystem. Updating...");
                changesMade = true;
                break;
            }
            // Handle changed commands
            // @ts-ignore
            changesMade = !remoteCmd.equals(localCmd);
        }
        // Handle deleted commands
        for (let remoteCmd of fetched) {
            if (!this.commands.find((i) => i.name === remoteCmd.name)) {
                this.debug("Commands match check failed because local command files are missing from the fetched command list. Updating...");
                changesMade = true;
                break;
            }
        }
        return changesMade;
    }
}
exports.CommandHandler = CommandHandler;
