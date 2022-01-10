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
const CommandDirectoryReferenceError_1 = require("./errors/CommandDirectoryReferenceError");
const events_1 = require("events");
const LocalUtils_1 = require("./LocalUtils");
const glob_1 = require("glob");
const path = require("path");
class CommandHandler extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (!options.client)
            throw new ReferenceError("CommandHandler(): options.client is required.");
        this.client = options.client;
        this.directory = options.directory;
        this.prefix = options.prefix || "?";
        this.owners = options.owners || [];
        this.commands = new Map();
        this.aliases = new Map();
        this.userCooldowns = new Map();
        this.guildCooldowns = new Map();
        this.localUtils = new LocalUtils_1.LocalUtils(this, this.client, this.owners);
        this.setupMessageEvent();
        if (options.autoLoad !== false)
            this.loadCommands();
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
    setCommandDirectory(absolutePath) {
        if (!absolutePath)
            throw new CommandDirectoryReferenceError_1.default("absolutePath parameter is required.");
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
    loadCommands() {
        return new Promise((resolve, reject) => {
            if (!this.directory)
                return reject(new CommandDirectoryReferenceError_1.default("Command directory is not set. Use setCommandDirectory(path) prior."));
            (0, glob_1.glob)(this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js", (err, files) => {
                if (err)
                    return reject(new CommandDirectoryReferenceError_1.default("Supplied command directory is invalid. Please ensure it exists and is absolute."));
                for (const file of files) {
                    delete require.cache[file];
                    const parsedPath = path.parse(file);
                    // Require command class
                    let CommandFile;
                    try {
                        // Attempt CJS import
                        CommandFile = require(file);
                    }
                    catch (_a) {
                        // Attempt ESM import
                        CommandFile = Promise.resolve().then(() => require(file));
                    }
                    console.log(CommandFile);
                    if (!CommandFile)
                        return this.emit("dubug", `${parsedPath} failed to load.`);
                    // Check if is class
                    if (!this.localUtils.isClass(CommandFile))
                        throw new TypeError(`registerCommand(): Command ${parsedPath.name} doesn't export any classes.`);
                    // Initialize command class
                    const cmd = new CommandFile(this, this.client, parsedPath.name.toLowerCase());
                    this.registerCommand(cmd);
                }
            });
        });
    }
    registerCommand(command, filename) {
        var _a;
        this.commands.set(command.name, command);
        if ((_a = command.aliases) === null || _a === void 0 ? void 0 : _a.length)
            command.aliases.forEach((alias) => this.aliases.set(alias, command.name));
        this.emit("debug", `Registered command "${command.name}"${filename ? ` from file ${filename}` : ""}`);
        this.emit("load", command);
    }
    setupMessageEvent() {
        this.client.on("messageCreate", (message) => __awaiter(this, void 0, void 0, function* () {
            if (message.partial)
                yield message.fetch();
            if (message.author.bot)
                return;
            if (!message.content.startsWith(this.prefix))
                return;
            let [typedCommand, ...args] = message.content.slice(this.prefix.length).trim().split(/ +/g);
            if (!typedCommand)
                return;
            typedCommand = typedCommand.trim();
            // @ts-ignore
            const command = this.commands.get(typedCommand.toLowerCase()) || this.commands.get(this.aliases.get(typedCommand.toLowerCase()));
            if (!command)
                return;
            // Handle additional command parameters
            if (!command.allowDm && message.channel.type === "DM")
                return;
            const failedReason = yield this.localUtils.verifyCommand(message, command, this.userCooldowns, this.guildCooldowns);
            if (failedReason) {
                this.emit("error", failedReason, message);
                return;
            }
            try {
                yield command.run(message, args);
            }
            catch (ex) {
                console.error(ex);
                this.emit("error", ex);
            }
        }));
    }
}
exports.CommandHandler = CommandHandler;
