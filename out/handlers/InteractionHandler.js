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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionHandler = void 0;
var discord_js_1 = require("discord.js");
var events_1 = require("events");
var LocalUtils_1 = require("../util/LocalUtils");
var glob_1 = require("glob");
var path = require("path");
var InteractionDirectoryReferenceError_1 = require("../errors/InteractionDirectoryReferenceError");
var index_1 = require("../index");
var InteractionHandler = /** @class */ (function (_super) {
    __extends(InteractionHandler, _super);
    function InteractionHandler(options) {
        var _this = _super.call(this) || this;
        if (!options.client)
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        _this.client = options.client;
        _this.directory = options.directory;
        _this.owners = options.owners || [];
        _this.disableInteractionModification = options.disableInteractionModification || false;
        _this.forceInteractionUpdate = options.forceInteractionUpdate || false;
        _this.interactions = new Map();
        _this.localUtils = new LocalUtils_1.LocalUtils(_this, _this.client, _this.owners);
        if (options.autoLoad === undefined || !options.autoLoad)
            _this.loadInteractions();
        if (!_this.client) {
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        }
        _this.client.on("ready", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.emit("debug", "Client.application assigned.");
                this.application = this.client.application;
                return [2 /*return*/];
            });
        }); });
        return _this;
    }
    /**
     * Sets directory for interactions
     *
     * @returns InteractionHandler
     *
     * @remarks
     * This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     * @param absolutePath Absolute path to directory. Recommended to concatenate it using `path.join() and process.cwd()`
     * */
    InteractionHandler.prototype.setInteractionsDirectory = function (absolutePath) {
        if (!absolutePath)
            throw new InteractionDirectoryReferenceError_1.default("setInteractionsDirectory(): absolutePath parameter is required.");
        this.directory = absolutePath;
        return this;
    };
    /**
     * Loads interaction commands into memory
     *
     * @returns InteractionHandler
     *
     * @remarks
     * Requires @see {@link InteractionHandler.setInteractionsDirectory} to be executed first, or `directory` to be specified in the constructor.
     * */
    InteractionHandler.prototype.loadInteractions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var dirPattern;
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.directory)
                    return [2 /*return*/, reject(new InteractionDirectoryReferenceError_1.default("Interactions directory is not set. Use setInteractionsDirectory(path) prior."))];
                dirPattern = this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js";
                (0, glob_1.glob)(dirPattern, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                    var duplicates, _i, files_1, file, parsedPath, InteractionFile, interaction;
                    var _this = this;
                    return __generator(this, function (_a) {
                        this.emit("debug", "Found ".concat(files.length, " interaction files."));
                        if (err)
                            return [2 /*return*/, reject(new InteractionDirectoryReferenceError_1.default("Supplied interactions directory is invalid. Please ensure it exists and is absolute."))];
                        duplicates = [];
                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                            file = files_1[_i];
                            parsedPath = path.parse(file);
                            InteractionFile = require(file);
                            if (!InteractionFile)
                                return [2 /*return*/, this.emit("dubug", "".concat(parsedPath, " failed to load."))];
                            // Check if is class
                            if (!this.localUtils.isClass(InteractionFile))
                                throw new TypeError("Interaction ".concat(parsedPath.name, " doesn't export any of the correct classes."));
                            interaction = new InteractionFile(this, this.client, parsedPath.name.toLowerCase());
                            // Check if initialized class is extending Command
                            if (!(interaction instanceof index_1.CommandInteraction || interaction instanceof index_1.UserContextMenuInteraction || interaction instanceof index_1.MessageContextMenuInteraction))
                                throw new TypeError("Interaction file: ".concat(parsedPath.name, " doesn't extend one of the valid the interaction classes: CommandInteraction, UserContextMenuInteraction, MessageContextMenuInteraction."));
                            // Save command to map
                            if (this.interactions.get(interaction.type + "_" + interaction.name)) {
                                duplicates.push(interaction);
                                continue;
                            }
                            this.interactions.set(interaction.type + "_" + interaction.name, interaction);
                            this.emit("debug", "Loaded interaction \"".concat(interaction.name, "\" from file \"").concat(parsedPath.base, "\""));
                            this.emit("load", interaction);
                        }
                        if (duplicates === null || duplicates === void 0 ? void 0 : duplicates.length)
                            throw new Error("Loading interaction with the same name: ".concat(duplicates.map(function (d) { return d.name; }).join(", "), "."));
                        if (!this.disableInteractionModification)
                            this.client.on("ready", function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.postInteractions(this.forceInteractionUpdate)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        this.emit("ready");
                        resolve(this.interactions);
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    InteractionHandler.prototype.runInteraction = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (res, rej) {
            if (interaction.user.bot)
                return rej("Bot users can't run interactions.");
            if (interaction.isCommand())
                _this.handleCommandInteraction.apply(_this, __spreadArray([interaction], additionalOptions, false)).then(res)
                    .catch(rej);
            if (interaction.isContextMenu())
                _this.handleContextMenuInteraction.apply(_this, __spreadArray([interaction], additionalOptions, false)).then(res)
                    .catch(rej);
        });
    };
    InteractionHandler.prototype.handleCommandInteraction = function (interaction) {
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                        var slashCommand, failedReason;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    slashCommand = this.interactions.get("CHAT_INPUT_" + interaction.commandName.toLowerCase());
                                    if (!slashCommand)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, this.localUtils.verifyInteraction(interaction, slashCommand)];
                                case 1:
                                    failedReason = _a.sent();
                                    if (failedReason) {
                                        rej(failedReason);
                                        return [2 /*return*/];
                                    }
                                    try {
                                        slashCommand.run.apply(slashCommand, __spreadArray([interaction], additionalOptions, false));
                                        res(slashCommand);
                                    }
                                    catch (ex) {
                                        console.error(ex);
                                        rej(ex);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @ignore
     * */
    InteractionHandler.prototype.handleContextMenuInteraction = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var contextMenuInt, failedReason;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contextMenuInt = this.interactions.get("USER_" + interaction.commandName.toLowerCase()) || this.interactions.get("MESSAGE_" + interaction.commandName.toLowerCase());
                        if (!contextMenuInt)
                            return [2 /*return*/];
                        // @ts-ignore
                        if (interaction.targetType === "USER" && contextMenuInt.type !== "USER")
                            return [2 /*return*/];
                        // @ts-ignore
                        if (interaction.targetType === "MESSAGE" && contextMenuInt.type !== "MESSAGE")
                            return [2 /*return*/];
                        return [4 /*yield*/, this.localUtils.verifyInteraction(interaction, contextMenuInt)];
                    case 1:
                        failedReason = _a.sent();
                        if (failedReason) {
                            reject(failedReason);
                            return [2 /*return*/];
                        }
                        try {
                            contextMenuInt.run.apply(contextMenuInt, __spreadArray([interaction], additionalOptions, false));
                            resolve(contextMenuInt);
                        }
                        catch (ex) {
                            console.error(ex);
                            reject(ex);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @ignore
     * */
    InteractionHandler.prototype.postInteractions = function (force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var changes, fetchedInteractions, formed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!force) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.application.commands.fetch().catch(function (err) {
                                throw new Error("Can't fetch client commands: ".concat(err));
                            })];
                    case 1:
                        fetchedInteractions = _a.sent();
                        if (!fetchedInteractions)
                            throw new TypeError("Interactions weren't fetched.");
                        return [4 /*yield*/, this.didChange(fetchedInteractions)];
                    case 2:
                        changes = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(changes || force)) return [3 /*break*/, 5];
                        this.emit("debug", "Changes in interaction files detected - re-creating the interactions. Please wait.");
                        formed = Array.from(this.interactions, function (_a) {
                            var _ = _a[0], data = _a[1];
                            if (data.type === "CHAT_INPUT") {
                                // @ts-ignore
                                return { name: data.name, description: data.description, defaultPermission: data.defaultPermission, options: data.options, type: data.type };
                            }
                            if (data.type === "USER")
                                return { name: data.name, type: data.type };
                            if (data.type === "MESSAGE")
                                return { name: data.name, type: data.type };
                        });
                        // @ts-ignore
                        return [4 /*yield*/, this.application.commands.set(formed).then(function (r) { return _this.emit("debug", "Set interactions (" + r.size + " returned)"); })];
                    case 4:
                        // @ts-ignore
                        _a.sent();
                        this.emit("debug", "Interaction changes were posted successfully. Remember to wait a bit (up to 1 hour) or kick and add the bot back to see changes.");
                        return [3 /*break*/, 6];
                    case 5:
                        this.emit("debug", "No changes in interactions - not refreshing.");
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @ignore
     * */
    InteractionHandler.prototype.didChange = function (interactions) {
        return __awaiter(this, void 0, void 0, function () {
            var fetched, existing, _loop_1, _i, existing_1, localCmd, state_1, _loop_2, this_1, _a, fetched_1, remoteCmd, state_2;
            return __generator(this, function (_b) {
                fetched = Array.from(interactions, function (_a) {
                    var _ = _a[0], data = _a[1];
                    return data;
                });
                existing = Array.from(this.interactions, function (_a) {
                    var _ = _a[0], data = _a[1];
                    return data;
                });
                _loop_1 = function (localCmd) {
                    var remoteCmd = fetched.find(function (cmd) { return cmd.name === localCmd.name; });
                    if (!remoteCmd)
                        return { value: true };
                    var oldOptions = remoteCmd.options;
                    var modifiedRemoteCmd = remoteCmd;
                    delete modifiedRemoteCmd.options;
                    delete modifiedRemoteCmd.version;
                    delete modifiedRemoteCmd.guild;
                    delete modifiedRemoteCmd.id;
                    delete modifiedRemoteCmd.applicationId;
                    var modifiedLocalCmd = {
                        name: localCmd.name,
                        type: localCmd.type,
                    };
                    var equals = modifiedRemoteCmd.equals(modifiedLocalCmd);
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
                        var optionsEqual = discord_js_1.ApplicationCommand.optionsEqual(oldOptions, localCmd.options);
                        if (!equals || !optionsEqual)
                            return { value: true };
                    }
                    // @ts-ignore
                    if (!equals)
                        return { value: true };
                };
                for (_i = 0, existing_1 = existing; _i < existing_1.length; _i++) {
                    localCmd = existing_1[_i];
                    state_1 = _loop_1(localCmd);
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                }
                _loop_2 = function (remoteCmd) {
                    if (!existing.find(function (c) { return c.name === remoteCmd.name; })) {
                        this_1.emit("debug", "Refreshing interactions because interaction files have been deleted.");
                        return { value: true };
                    }
                };
                this_1 = this;
                for (_a = 0, fetched_1 = fetched; _a < fetched_1.length; _a++) {
                    remoteCmd = fetched_1[_a];
                    state_2 = _loop_2(remoteCmd);
                    if (typeof state_2 === "object")
                        return [2 /*return*/, state_2.value];
                }
                return [2 /*return*/, false];
            });
        });
    };
    return InteractionHandler;
}(events_1.EventEmitter));
exports.InteractionHandler = InteractionHandler;
