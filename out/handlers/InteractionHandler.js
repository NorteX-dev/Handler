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
var Handler_1 = require("./Handler");
var glob_1 = require("glob");
var path = require("path");
var DirectoryReferenceError_1 = require("../errors/DirectoryReferenceError");
var index_1 = require("../index");
var InteractionHandler = /** @class */ (function (_super) {
    __extends(InteractionHandler, _super);
    function InteractionHandler(options) {
        var _this = _super.call(this, options) || this;
        if (!options.client)
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        _this.client = options.client;
        _this.directory = options.directory ? path.join(process.cwd(), options.directory) : undefined;
        _this.owners = options.owners || [];
        _this.interactions = new Map();
        if (options.autoLoad === undefined || !options.autoLoad)
            _this.loadInteractions();
        _this.client.on("ready", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.debug("Client.application assigned.");
                this.application = this.client.application;
                return [2 /*return*/];
            });
        }); });
        return _this;
    }
    /**
     * Loads interaction commands into memory
     *
     * @returns InteractionHandler
     *
     * @remarks
     * Requires @see {@link InteractionHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * Run {@link InteractionHandler.runInteraction()} to be invoked to run the ocmmand on an event.
     * */
    InteractionHandler.prototype.loadInteractions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.directory)
                    return [2 /*return*/, reject(new DirectoryReferenceError_1.default("Interactions directory is not set. Use setDirectory(path) prior."))];
                (0, glob_1.glob)(path.join(process.cwd(), this.directory), {}, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                    var duplicates, _i, files_1, file, parsedPath, InteractionConstructor, interaction;
                    return __generator(this, function (_a) {
                        if (err)
                            throw err;
                        this.debug("Found ".concat(files.length, " interaction files."));
                        if (err)
                            return [2 /*return*/, reject(new DirectoryReferenceError_1.default("Supplied interactions directory is invalid. Please ensure it exists and is absolute."))];
                        duplicates = [];
                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                            file = files_1[_i];
                            parsedPath = path.parse(file);
                            InteractionConstructor = require(file);
                            if (!InteractionConstructor) {
                                this.debug("".concat(parsedPath, " failed to load. The file was loaded but cannot be required."));
                                continue;
                            }
                            // Check if is class
                            if (!this.localUtils.isClass(InteractionConstructor))
                                throw new TypeError("Interaction ".concat(parsedPath.name, " doesn't export a class."));
                            interaction = new InteractionConstructor(this, parsedPath.name.toLowerCase());
                            // Check if initialized class is extending Command
                            if (!(interaction instanceof index_1.InteractionCommand || interaction instanceof index_1.UserContextMenu || interaction instanceof index_1.MessageContextMenu))
                                throw new TypeError("Interaction file: ".concat(parsedPath.name, " doesn't extend one of the valid the interaction classes: CommandInteraction, UserContextMenuInteraction, MessageContextMenuInteraction. Use ComponentHandler to handle buttons, select menus and other components."));
                            // Save command to map
                            if (this.interactions.get(interaction.type + "_" + interaction.name)) {
                                duplicates.push(interaction);
                                continue;
                            }
                            this.interactions.set(interaction.type + "_" + interaction.name, interaction);
                            this.debug("Loaded interaction \"".concat(interaction.name, "\" from file \"").concat(parsedPath.base, "\"."));
                            this.emit("load", interaction);
                        }
                        if (duplicates === null || duplicates === void 0 ? void 0 : duplicates.length)
                            throw new Error("Loading interaction with the same name: ".concat(duplicates.map(function (d) { return d.name; }).join(", "), "."));
                        resolve(this.interactions);
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<Interaction>
     *
     * */
    InteractionHandler.prototype.runInteraction = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (res, rej) {
            if (interaction.user.bot)
                return rej("Bot users can't run interactions.");
            if (interaction.isCommand()) {
                _this.handleCommandInteraction.apply(_this, __spreadArray([interaction], additionalOptions, false)).then(res)
                    .catch(rej);
            }
            else if (interaction.isContextMenu()) {
                _this.handleContextMenuInteraction.apply(_this, __spreadArray([interaction], additionalOptions, false)).then(res)
                    .catch(rej);
            }
            else {
                throw new Error("InteractionHandler#runInteraction(): Unsupported interaction type. This only supports command and context menus interactions. You should check the type beforehand, or refer to ComponentHandler() to handle components.");
            }
        });
    };
    /**
     * @ignore
     * */
    InteractionHandler.prototype.handleCommandInteraction = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var applicationCommand, failedReason;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        applicationCommand = this.interactions.get("CHAT_INPUT_" + interaction.commandName.toLowerCase());
                        if (!applicationCommand)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.localUtils.verifyInteraction(interaction, applicationCommand)];
                    case 1:
                        failedReason = _a.sent();
                        if (failedReason) {
                            rej(failedReason);
                            return [2 /*return*/];
                        }
                        try {
                            applicationCommand.run.apply(applicationCommand, __spreadArray([interaction], additionalOptions, false));
                            res(applicationCommand);
                        }
                        catch (ex) {
                            console.error(ex);
                            rej(ex);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
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
                        if (interaction.targetType === "USER" && contextMenuInt.type !== "USER")
                            return [2 /*return*/];
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
    InteractionHandler.prototype.updateInteractions = function (force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var changesMade, fetchedInteractions, interactionsArray, interactionsToSend_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        changesMade = false;
                        if (!force) return [3 /*break*/, 1];
                        // Forcing update, automatically assume changes were made
                        this.debug("Skipping checks and updating interactions.");
                        changesMade = true;
                        return [3 /*break*/, 4];
                    case 1:
                        // Fetch existing interactions and compare to loaded
                        this.debug("Checking for differences.");
                        if (!this.application)
                            throw new Error("updateInteractions(): client.application is undefined. Make sure you are executing updateInteractions() after the client has emitted the 'ready' event.");
                        return [4 /*yield*/, this.application.commands.fetch().catch(function (err) {
                                throw new Error("Can't fetch client commands: ".concat(err));
                            })];
                    case 2:
                        fetchedInteractions = _a.sent();
                        if (!fetchedInteractions)
                            throw new Error("Interactions weren't fetched.");
                        return [4 /*yield*/, this.checkDiff(fetchedInteractions)];
                    case 3:
                        changesMade = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!changesMade) return [3 /*break*/, 6];
                        interactionsArray = Array.from(this.interactions, function (_a) {
                            var _key = _a[0], interaction = _a[1];
                            return interaction;
                        }).filter(function (r) { return ["CHAT_INPUT", "USER", "MESSAGE"].includes(r.type); });
                        interactionsToSend_1 = [];
                        interactionsArray.forEach(function (interaction) {
                            if (interaction.type === "CHAT_INPUT" && interaction instanceof index_1.InteractionCommand) {
                                interactionsToSend_1.push({
                                    type: "CHAT_INPUT",
                                    name: interaction.name,
                                    description: interaction.description,
                                    defaultPermission: interaction.defaultPermission,
                                    permissions: interaction.permissions,
                                    options: interaction.options,
                                });
                            }
                            else if (interaction.type === "USER" && interaction instanceof index_1.UserContextMenu) {
                                interactionsToSend_1.push({ type: "USER", name: interaction.name });
                            }
                            else if (interaction.type === "MESSAGE" && interaction instanceof index_1.MessageContextMenu) {
                                interactionsToSend_1.push({ type: "MESSAGE", name: interaction.name });
                            }
                            else {
                                _this.debug("Interaction type ".concat(interaction.type, " is not supported."));
                            }
                        });
                        // @ts-ignore
                        return [4 /*yield*/, this.application.commands.set(interactionsArray)
                                .then(function (returned) {
                                _this.debug("Updated interactions (".concat(returned.size, " returned). Wait a bit (up to 1 hour) for the cache to update or kick and add the bot back to see changes."));
                                _this.emit("ready");
                            })
                                .catch(function (err) {
                                throw new Error("Can't update client commands: ".concat(err));
                            })];
                    case 5:
                        // @ts-ignore
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        this.debug("No changes in interactions - not refreshing.");
                        this.emit("ready");
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @ignore
     * */
    InteractionHandler.prototype.checkDiff = function (interactions) {
        return __awaiter(this, void 0, void 0, function () {
            var fetched, existing, changesMade, _loop_1, _i, existing_1, localCmd, state_1, _loop_2, this_1, _a, fetched_1, remoteCmd, state_2;
            return __generator(this, function (_b) {
                fetched = Array.from(interactions, function (_a) {
                    var _ = _a[0], data = _a[1];
                    return data;
                });
                existing = Array.from(this.interactions, function (_a) {
                    var _ = _a[0], data = _a[1];
                    return data;
                });
                changesMade = false;
                _loop_1 = function (localCmd) {
                    var remoteCmd = fetched.find(function (f) { return f.name === localCmd.name; });
                    if (!remoteCmd) {
                        changesMade = true;
                        return "break";
                    }
                    changesMade = !remoteCmd.equals(localCmd);
                };
                for (_i = 0, existing_1 = existing; _i < existing_1.length; _i++) {
                    localCmd = existing_1[_i];
                    state_1 = _loop_1(localCmd);
                    if (state_1 === "break")
                        break;
                }
                _loop_2 = function (remoteCmd) {
                    if (!existing.find(function (c) { return c.name === remoteCmd.name; })) {
                        this_1.debug("Interactions match check failed because local interaction files are missing from the filesystem. Updating...");
                        changesMade = true;
                        return "break";
                    }
                };
                this_1 = this;
                for (_a = 0, fetched_1 = fetched; _a < fetched_1.length; _a++) {
                    remoteCmd = fetched_1[_a];
                    state_2 = _loop_2(remoteCmd);
                    if (state_2 === "break")
                        break;
                }
                // Assume match
                return [2 /*return*/, changesMade];
            });
        });
    };
    return InteractionHandler;
}(Handler_1.Handler));
exports.InteractionHandler = InteractionHandler;
