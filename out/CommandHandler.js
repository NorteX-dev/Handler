"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
var CommandDirectoryReferenceError_1 = require("./errors/CommandDirectoryReferenceError");
var events_1 = require("events");
var LocalUtils_1 = require("./LocalUtils");
var glob_1 = require("glob");
var path = require("path");
var CommandHandler = /** @class */ (function (_super) {
    __extends(CommandHandler, _super);
    function CommandHandler(options) {
        var _this = _super.call(this) || this;
        if (!options.client)
            throw new ReferenceError("CommandHandler(): options.client is required.");
        _this.client = options.client;
        _this.directory = options.directory;
        _this.enableDebug = options.debug || false;
        _this.prefix = options.prefix || "?";
        _this.owners = options.owners || [];
        _this.commands = new Map();
        _this.aliases = new Map();
        _this.userCooldowns = new Map();
        _this.guildCooldowns = new Map();
        _this.localUtils = new LocalUtils_1.LocalUtils(_this.client, _this.enableDebug, _this.owners);
        _this.setupMessageEvent();
        if (options.autoLoad)
            _this.loadCommands();
        return _this;
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
    CommandHandler.prototype.setCommandDirectory = function (absolutePath) {
        if (!absolutePath)
            throw new CommandDirectoryReferenceError_1.default("absolutePath parameter is required.");
        this.directory = absolutePath;
        return this;
    };
    /*
     * Loads classic message commands into memory
     *
     * @returns CommandHandler
     *
     * @remarks
     * Requires @see {CommandHandler.setCommandDirectory} to be executed first, or commandDirectory to be specified in the CommandHandler constructor.
     * */
    CommandHandler.prototype.loadCommands = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.directory)
                return reject(new CommandDirectoryReferenceError_1.default("Command directory is not set. Use setCommandDirectory(path) prior."));
            (0, glob_1.glob)(_this.directory.endsWith("/") ? _this.directory + "**/*.js" : _this.directory + "/**/*.js", function (err, files) {
                if (err)
                    return reject(new CommandDirectoryReferenceError_1.default("Supplied command directory is invalid. Please ensure it exists and is absolute."));
                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                    var file = files_1[_i];
                    delete require.cache[file];
                    var parsedPath = path.parse(file);
                    // Require command class
                    var CommandFile = require(file);
                    // Check if is class
                    if (!_this.localUtils.isClass(CommandFile))
                        throw new TypeError("registerCommand(): Command " + parsedPath.name + " doesn't export any classes.");
                    // Initialize command class
                    var cmd = new CommandFile(_this, _this.client, parsedPath.name.toLowerCase());
                    _this.registerCommand(cmd);
                }
            });
        });
    };
    CommandHandler.prototype.registerCommand = function (command, filename) {
        var _this = this;
        this.commands.set(command.name, command);
        if (command.aliases.length)
            command.aliases.forEach(function (alias) { return _this.aliases.set(alias, command.name); });
        this.localUtils.debug("Registered command \"" + command.name + "\"" + (filename ? " from file " + filename : "") + "\"");
        this.emit("load", command);
    };
    CommandHandler.prototype.setupMessageEvent = function () {
        var _this = this;
        this.client.on("messageCreate", function (message) { return __awaiter(_this, void 0, void 0, function () {
            var _a, typedCommand, args, command, failedReason, ex_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!message.partial) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.fetch()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (message.author.bot)
                            return [2 /*return*/];
                        if (!message.content.startsWith(this.prefix))
                            return [2 /*return*/];
                        _a = message.content.slice(this.prefix.length).trim().split(/ +/g), typedCommand = _a[0], args = _a.slice(1);
                        if (!typedCommand)
                            return [2 /*return*/];
                        typedCommand = typedCommand.trim();
                        command = this.commands.get(typedCommand.toLowerCase()) || this.commands.get(this.aliases.get(typedCommand.toLowerCase()));
                        if (!command)
                            return [2 /*return*/];
                        // Handle additional command parameters
                        if (!command.allowDm && message.channel.type === "DM")
                            return [2 /*return*/];
                        return [4 /*yield*/, this.localUtils.verifyCommand(message, command, this.userCooldowns, this.guildCooldowns)];
                    case 3:
                        failedReason = _b.sent();
                        if (failedReason) {
                            this.emit("error", failedReason, message);
                            return [2 /*return*/];
                        }
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, command.run(message, args)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        ex_1 = _b.sent();
                        console.error(ex_1);
                        this.emit("Command errored while executing:\n*" + ex_1 + "*");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    return CommandHandler;
}(events_1.EventEmitter));
exports.CommandHandler = CommandHandler;
