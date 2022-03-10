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
const ExecutionError_1 = require("../errors/ExecutionError");
const Handler_1 = require("./Handler");
const Command_1 = require("../structures/Command");
const CommandsStore_1 = require("../store/CommandsStore");
class CommandHandler extends Handler_1.Handler {
    constructor(options) {
        var _a;
        super(options);
        this.owners = options.owners || [];
        this.commands = new CommandsStore_1.default();
        this.aliases = new Map();
        this.userCooldowns = new Map();
        this.guildCooldowns = new Map();
        this.setPrefix((_a = options.prefix) !== null && _a !== void 0 ? _a : "?");
        if (options.autoLoad === undefined || options.autoLoad === false)
            this.loadCommands();
        return this;
    }
    /**
     * Sets a prefix
     *
     * @param prefix Prefix to set
     *
     * @returns CommandHandler
     * */
    setPrefix(prefix) {
        if (prefix === undefined)
            throw new ReferenceError("setPrefix(): prefix parameter is required as a string or string[].");
        if (typeof prefix === "string")
            prefix = [prefix];
        this.prefix = prefix;
        return this;
    }
    /**
     * Loads classic message commands into memory
     *
     * @returns CommandsStore
     *
     * @remarks
     * Requires @see {@link CommandHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * */
    loadCommands() {
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const files = yield this.loadAndInstance().catch(rej);
            files.forEach((cmd) => this.registerCommand(cmd));
            return res(this.commands);
        }));
    }
    /**
     * Manually register an instanced command. This should not be needed when using loadCommands().
     *
     * @returns Command
     * */
    registerCommand(command) {
        if (!(command instanceof Command_1.Command))
            throw new TypeError(`registerCommand(): command parameter is not an instance of Command.`);
        if (this.commands.get(command.name))
            throw new Error(`Command ${command.name} cannot be registered twice.`);
        this.commands.add(command);
        if (command.aliases && command.aliases.length)
            command.aliases.forEach((alias) => this.aliases.set(alias, command.name));
        this.emit("load", command);
        this.debug(`Registered command "${command.name}".`);
        return command;
    }
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<Command>
     * */
    runCommand(message, ...additionalOptions) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (message.partial)
                yield message.fetch();
            let prefixes = this.prefix;
            if (!prefixes || !prefixes.length)
                prefixes = ["?"];
            for (let prefix of prefixes) {
                if (!message.content.startsWith(prefix))
                    continue;
                let [typedCommand, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
                if (!typedCommand)
                    return;
                typedCommand = typedCommand.trim();
                // @ts-ignore
                const command = this.commands.get(typedCommand.toLowerCase()) || this.commands.get(this.aliases.get(typedCommand.toLowerCase()));
                if (!command)
                    return reject(new ExecutionError_1.default("Command not found.", "COMMAND_NOT_FOUND", { query: typedCommand }));
                if (!(command instanceof Command_1.Command))
                    return reject(new ExecutionError_1.default("Attempting to run non-command class with runCommand().", "INVALID_CLASS"));
                // Handle additional command parameters
                if (!command.allowDm && message.channel.type === "DM")
                    return reject(new ExecutionError_1.default("Command cannot be executed in DM.", "COMMAND_NOT_ALLOWED_IN_DM", { command }));
                const failedReason = yield this.localUtils.verifyCommand(message, command, this.userCooldowns, this.guildCooldowns);
                if (failedReason) {
                    reject(failedReason);
                    return;
                }
                if (command.usage)
                    command.usage = `${prefix}${command.name} ${command.usage}` || "";
                try {
                    command.run(message, args, ...additionalOptions);
                    resolve(command);
                }
                catch (ex) {
                    console.error(ex);
                    reject(ex);
                }
            }
        }));
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map