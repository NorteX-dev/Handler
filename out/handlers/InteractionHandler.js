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
var Handler_1 = require("./Handler");
var ExecutionError_1 = require("../errors/ExecutionError");
var InteractionCommand_1 = require("../structures/InteractionCommand");
var Verificators_1 = require("../util/Verificators");
var UserContextMenu_1 = require("../structures/UserContextMenu");
var MessageContextMenu_1 = require("../structures/MessageContextMenu");
var PERMISSION_FLAGS = {
    CREATE_INSTANT_INVITE: BigInt(1) << BigInt(0),
    KICK_MEMBERS: BigInt(1) << BigInt(1),
    BAN_MEMBERS: BigInt(1) << BigInt(2),
    ADMINISTRATOR: BigInt(1) << BigInt(3),
    MANAGE_CHANNELS: BigInt(1) << BigInt(4),
    MANAGE_GUILD: BigInt(1) << BigInt(5),
    ADD_REACTIONS: BigInt(1) << BigInt(6),
    VIEW_AUDIT_LOG: BigInt(1) << BigInt(7),
    PRIORITY_SPEAKER: BigInt(1) << BigInt(8),
    STREAM: BigInt(1) << BigInt(9),
    VIEW_CHANNEL: BigInt(1) << BigInt(10),
    SEND_MESSAGES: BigInt(1) << BigInt(11),
    SEND_TTS_MESSAGES: BigInt(1) << BigInt(12),
    MANAGE_MESSAGES: BigInt(1) << BigInt(13),
    EMBED_LINKS: BigInt(1) << BigInt(14),
    ATTACH_FILES: BigInt(1) << BigInt(15),
    READ_MESSAGE_HISTORY: BigInt(1) << BigInt(16),
    MENTION_EVERYONE: BigInt(1) << BigInt(17),
    USE_EXTERNAL_EMOJIS: BigInt(1) << BigInt(18),
    VIEW_GUILD_INSIGHTS: BigInt(1) << BigInt(19),
    CONNECT: BigInt(1) << BigInt(20),
    SPEAK: BigInt(1) << BigInt(21),
    MUTE_MEMBERS: BigInt(1) << BigInt(22),
    DEAFEN_MEMBERS: BigInt(1) << BigInt(23),
    MOVE_MEMBERS: BigInt(1) << BigInt(24),
    USE_VAD: BigInt(1) << BigInt(25),
    CHANGE_NICKNAME: BigInt(1) << BigInt(26),
    MANAGE_NICKNAMES: BigInt(1) << BigInt(27),
    MANAGE_ROLES: BigInt(1) << BigInt(28),
    MANAGE_WEBHOOKS: BigInt(1) << BigInt(29),
    MANAGE_EMOJIS_AND_STICKERS: BigInt(1) << BigInt(30),
    USE_APPLICATION_COMMANDS: BigInt(1) << BigInt(31),
    REQUEST_TO_SPEAK: BigInt(1) << BigInt(32),
    MANAGE_EVENTS: BigInt(1) << BigInt(33),
    MANAGE_THREADS: BigInt(1) << BigInt(34),
    CREATE_PUBLIC_THREADS: BigInt(1) << BigInt(35),
    CREATE_PRIVATE_THREADS: BigInt(1) << BigInt(36),
    USE_EXTERNAL_STICKERS: BigInt(1) << BigInt(37),
    SEND_MESSAGES_IN_THREADS: BigInt(1) << BigInt(38),
    USE_EMBEDDED_ACTIVITIES: BigInt(1) << BigInt(39),
    MODERATE_MEMBERS: BigInt(1) << BigInt(40),
};
var InteractionHandler = /** @class */ (function (_super) {
    __extends(InteractionHandler, _super);
    function InteractionHandler(options) {
        var _this = _super.call(this, options) || this;
        if (!options.client)
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        _this.client = options.client;
        _this.owners = options.owners || [];
        _this.interactions = [];
        if (options.autoLoad === undefined || options.autoLoad === false)
            _this.loadInteractions();
        return _this;
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
    InteractionHandler.prototype.loadInteractions = function () {
        var _this = this;
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load(false).catch(rej)];
                    case 1:
                        files = _a.sent();
                        files.forEach(function (interaction) { return _this.registerInteraction(interaction); });
                        return [2 /*return*/, res(this.interactions)];
                }
            });
        }); });
    };
    /**
     * Manually register an instanced interaction. This should not be needed when using loadInteractions().
     *
     * @returns Interaction
     * */
    InteractionHandler.prototype.registerInteraction = function (interaction) {
        if (!(interaction instanceof InteractionCommand_1.default || interaction instanceof UserContextMenu_1.default || interaction instanceof MessageContextMenu_1.default))
            throw new TypeError("registerInteraction(): interaction parameter must be an instance of InteractionCommand, UserContextMenu, MessageContextMenu.");
        if (this.interactions.find(function (c) { return c.name === interaction.name; }))
            throw new Error("Interaction ".concat(interaction.name, " cannot be registered twice."));
        if (!interaction.name)
            throw new Error("InteractionRunnable: name is required.");
        if (interaction instanceof InteractionCommand_1.default)
            if (!interaction.description)
                throw new Error("InteractionCommand: description is required.");
        this.interactions.push(interaction);
        this.debug("Loaded interaction \"".concat(interaction.name, "\"."));
        this.emit("load", interaction);
        return interaction;
    };
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<Interaction>
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
            var applicationCommand, isCorrectInstance, failedReason;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        applicationCommand = this.interactions.find(function (i) { return i.name === interaction.commandName.toLowerCase() && i.type === "CHAT_INPUT"; });
                        if (!applicationCommand)
                            return [2 /*return*/];
                        isCorrectInstance = applicationCommand instanceof InteractionCommand_1.default ||
                            applicationCommand instanceof UserContextMenu_1.default ||
                            applicationCommand instanceof MessageContextMenu_1.default;
                        if (!isCorrectInstance) {
                            throw new ExecutionError_1.default("Attempting to run non-interaction class with runInteraction().", "INVALID_CLASS");
                        }
                        return [4 /*yield*/, Verificators_1.default.verifyInteraction(interaction, applicationCommand)];
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
                        contextMenuInt = this.interactions.find(function (i) { return i.name === interaction.commandName.toLowerCase() && i.type === "USER"; }) ||
                            this.interactions.find(function (i) { return i.name === interaction.commandName.toLowerCase() && i.type === "MESSAGE"; });
                        if (!contextMenuInt)
                            return [2 /*return*/];
                        if (interaction.targetType === "USER" && contextMenuInt.type !== "USER")
                            return [2 /*return*/];
                        if (interaction.targetType === "MESSAGE" && contextMenuInt.type !== "MESSAGE")
                            return [2 /*return*/];
                        return [4 /*yield*/, Verificators_1.default.verifyInteraction(interaction, contextMenuInt)];
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
     * Compare the local version of the interactions to the ones in Discord API and update if needed.
     *
     * @returns Promise<boolean>
     *
     * @param {boolean} [force=false] Skip checks and set commands even if the local version is up to date.
     * */
    InteractionHandler.prototype.updateInteractions = function (force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                        var changesMade, fetchedInteractions, interactions;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!this.client.application)
                                        return [2 /*return*/, rej(new Error("updateInteractions(): client.application is undefined. Make sure you are executing updateInteractions() after the client has emitted the 'ready' event."))];
                                    changesMade = false;
                                    if (!force) return [3 /*break*/, 1];
                                    // Forcing update, automatically assume changes were made
                                    this.debug("Skipping checks and updating interactions.");
                                    changesMade = true;
                                    return [3 /*break*/, 3];
                                case 1:
                                    // Fetch existing interactions and compare to loaded
                                    this.debug("Checking for differences.");
                                    return [4 /*yield*/, this.client.application.commands.fetch().catch(function (err) {
                                            return rej(new Error("Can't fetch client commands: ".concat(err.message, ".\nMake sure you are executing updateInteractions() after the client has emitted the 'ready' event and 'this.client.application' is populated.")));
                                        })];
                                case 2:
                                    fetchedInteractions = _a.sent();
                                    if (!fetchedInteractions)
                                        return [2 /*return*/, rej(new Error("Interactions weren't fetched."))];
                                    changesMade = this.checkDiff(fetchedInteractions);
                                    _a.label = 3;
                                case 3:
                                    if (changesMade) {
                                        interactions = this.interactions.filter(function (r) { return ["CHAT_INPUT", "USER", "MESSAGE"].includes(r.type); });
                                        // @ts-ignore
                                        this.formatAndSend(interactions).then(res).catch(rej);
                                    }
                                    else {
                                        this.debug("No changes in interactions - not refreshing.");
                                        res(false); // Result with false (no changes)
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    InteractionHandler.prototype.formatAndSend = function (interactions) {
        var _this = this;
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var interactionsToSend;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        interactionsToSend = [];
                        interactions.forEach(function (interaction) {
                            if (interaction.type === "CHAT_INPUT" && interaction instanceof InteractionCommand_1.default) {
                                var data = {
                                    type: 1,
                                    application_id: _this.client.application.id,
                                    name: interaction.name,
                                    description: interaction.description,
                                    options: interaction.options,
                                    default_member_permissions: "0",
                                };
                                if (interaction.defaultPermissions) {
                                    data.default_member_permissions = interaction.defaultPermissions
                                        // @ts-ignore
                                        .map(function (e) { var _a; return (_a = PERMISSION_FLAGS[e]) !== null && _a !== void 0 ? _a : 0x0; })
                                        .reduce(function (a, b) { return a | b; }, BigInt(0x0))
                                        .toString();
                                }
                                console.log("ADDED ", data.default_member_permissions);
                                interactionsToSend.push(data);
                            }
                            else if (interaction.type === 2 && interaction instanceof UserContextMenu_1.default) {
                                interactionsToSend.push({ type: "USER", name: interaction.name });
                            }
                            else if (interaction.type === "MESSAGE" && interaction instanceof MessageContextMenu_1.default) {
                                interactionsToSend.push({ type: 3, name: interaction.name });
                            }
                            else {
                                _this.debug("Interaction type ".concat(interaction.type, " is not supported."));
                            }
                        });
                        return [4 /*yield*/, this.client
                                .application.commands // @ts-ignore
                                .set(interactions)
                                .then(function (returned) {
                                _this.debug("Updated interactions (".concat(returned.size, " returned). Wait a bit (up to 1 hour) for the cache to update or kick and add the bot back to see changes."));
                                res(true); // Result with true (updated)
                            })
                                .catch(function (err) {
                                return rej(new Error("Can't update client commands: ".concat(err)));
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @ignore
     * */
    InteractionHandler.prototype.checkDiff = function (interactions) {
        var fetched = Array.from(interactions.values()); // Collection to array conversion
        // Assume no changes made
        var changesMade = false;
        var _loop_1 = function (localCmd) {
            var remoteCmd = fetched.find(function (f) { return f.name === localCmd.name; });
            if (!remoteCmd) {
                // Handle created commands
                this_1.debug("Interactions match check failed because there are new files created in the filesystem. Updating...");
                changesMade = true;
                return "break";
            }
            // Handle changed commands
            // @ts-ignore Fine to ignore since we are only comparing a select amount of properties
            changesMade = !remoteCmd.equals(localCmd);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.interactions; _i < _a.length; _i++) {
            var localCmd = _a[_i];
            var state_1 = _loop_1(localCmd);
            if (state_1 === "break")
                break;
        }
        var _loop_2 = function (remoteCmd) {
            if (!this_2.interactions.find(function (i) { return i.name === remoteCmd.name; })) {
                this_2.debug("Interactions match check failed because local interaction files are missing from the filesystem. Updating...");
                changesMade = true;
                return "break";
            }
        };
        var this_2 = this;
        // Handle deleted commands
        for (var _b = 0, fetched_1 = fetched; _b < fetched_1.length; _b++) {
            var remoteCmd = fetched_1[_b];
            var state_2 = _loop_2(remoteCmd);
            if (state_2 === "break")
                break;
        }
        return changesMade;
    };
    return InteractionHandler;
}(Handler_1.default));
exports.default = InteractionHandler;
