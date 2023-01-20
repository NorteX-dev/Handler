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
exports.CommandHandler = void 0;
var discord_js_1 = require("discord.js");
var BaseHandler_1 = require("./BaseHandler");
var ExecutionError_1 = require("../errors/ExecutionError");
var Verificators_1 = require("../util/Verificators");
var Command_1 = require("../structures/Command");
var CommandHandler = /** @class */ (function (_super) {
    __extends(CommandHandler, _super);
    function CommandHandler(options) {
        var _this = _super.call(this, options) || this;
        if (!options.client)
            throw new ReferenceError("CommandHandler(): options.client is required.");
        _this.client = options.client;
        _this.commands = [];
        if (options.autoLoad === undefined || options.autoLoad === false)
            _this.loadCommands();
        return _this;
    }
    CommandHandler.prototype.loadCommands = function () {
        var _this = this;
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load(false /*emitReady*/).catch(rej)];
                    case 1:
                        files = _a.sent();
                        files.forEach(function (cmd) { return _this.registerCommand(cmd); });
                        return [2 /*return*/, res(this.commands)];
                }
            });
        }); });
    };
    CommandHandler.prototype.registerCommand = function (cmd) {
        if (!(cmd instanceof Command_1.Command))
            throw new TypeError("registerInteraction(): cmd parameter must be an instance of Command.");
        if (this.commands.find(function (c) { return c.name === cmd.name; }))
            throw new Error("Command ".concat(cmd.name, " cannot be registered twice."));
        // Verify & define defaults for optional fields
        if (!cmd.name) {
            throw new Error("registerCommand(): Can't register command that does not have a name. Define the command name with the @Name decorator.");
        }
        if (!cmd.description) {
            throw new Error("registerCommand(): Can't register command that does not have a description. Define the command description with the @Description decorator.");
        }
        if (!cmd.options)
            cmd.options = [];
        if (!cmd.defaultPermissions)
            cmd.defaultPermissions = [];
        if (!cmd.disabled)
            cmd.disabled = false;
        // Define handler and client properties on class
        Object.defineProperty(cmd, "handler", { value: this });
        Object.defineProperty(cmd, "client", { value: this.client });
        this.commands.push(cmd);
        this.debug("Loaded command \"".concat(cmd.name, "\"."));
        this.emit("load", cmd);
        return cmd;
    };
    CommandHandler.prototype.runCommand = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (res, rej) {
            if (interaction.user.bot)
                return rej("Bot users can't run interactions.");
            if (interaction.type === discord_js_1.InteractionType.ApplicationCommand) {
                _this.handleCommandRun.apply(_this, __spreadArray([interaction], additionalOptions, false)).then(res)
                    .catch(rej);
            }
            else if (interaction.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete) {
                // Polyfill for autocomplete interactions
                _this.handleAutocomplete.apply(_this, __spreadArray([interaction], additionalOptions, false)).then(res)
                    .catch(rej);
            }
            else {
                throw new Error("CommandHandler#runCommand(): Unsupported interaction type. This only supports commands. You should check the type beforehand, or refer to ComponentHandler() to handle component interactions.");
            }
        });
    };
    CommandHandler.prototype.updateInteractions = function (force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                        var changesMade, fetchedInteractions;
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
                                        this.formatAndSend(this.commands).then(res).catch(rej);
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
    CommandHandler.prototype.formatAndSend = function (commands) {
        var _this = this;
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var interactionsToSend;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        interactionsToSend = [];
                        commands.forEach(function (cmd) {
                            if (!(cmd instanceof Command_1.Command))
                                return _this.debug("Skipping ".concat(JSON.stringify(cmd), " - class does not extend Command."));
                            var data = {
                                type: discord_js_1.ApplicationCommandType.ChatInput,
                                application_id: _this.client.application.id,
                                name: cmd.name,
                                description: cmd.description,
                                options: cmd.options,
                                default_member_permissions: "0",
                            };
                            interactionsToSend.push(data);
                        });
                        return [4 /*yield*/, this.client
                                .application.commands.set(interactionsToSend)
                                .then(function (returned) {
                                _this.debug("Updated interactions (".concat(returned.size, " returned). Updates should be visible momentarily."));
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
    CommandHandler.prototype.handleCommandRun = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var cmd, failedReason;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = this.commands.find(function (i) { return i.name === interaction.commandName.toLowerCase(); });
                        if (!cmd)
                            return [2 /*return*/];
                        if (!(cmd instanceof Command_1.Command)) {
                            throw new ExecutionError_1.ExecutionError("Attempting to run non-command class with runCommand().", "INVALID_CLASS");
                        }
                        return [4 /*yield*/, Verificators_1.default.verifyCommand(interaction, cmd)];
                    case 1:
                        failedReason = _a.sent();
                        if (failedReason) {
                            rej(failedReason);
                            return [2 /*return*/];
                        }
                        try {
                            cmd.run.apply(cmd, __spreadArray([interaction], additionalOptions, false));
                            res(cmd);
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
    CommandHandler.prototype.handleAutocomplete = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                cmd = this.commands.find(function (cmd) { return cmd.name === interaction.commandName.toLowerCase(); });
                if (!cmd)
                    return [2 /*return*/];
                if (!(cmd instanceof Command_1.Command)) {
                    throw new ExecutionError_1.ExecutionError("Attempting to call autocomplete on non-command class.", "INVALID_CLASS");
                }
                if (!cmd["autocomplete"])
                    return [2 /*return*/];
                try {
                    cmd.autocomplete.apply(cmd, __spreadArray([interaction], additionalOptions, false));
                    res(cmd);
                }
                catch (ex) {
                    console.error(ex);
                    rej(ex);
                }
                return [2 /*return*/];
            });
        }); });
    };
    CommandHandler.prototype.checkDiff = function (interactions) {
        var fetched = Array.from(interactions.values()); // Collection to array conversion
        // Assume no changes made
        var changesMade = false;
        var _loop_1 = function (localCmd) {
            var remoteCmd = fetched.find(function (f) { return f.name === localCmd.name; });
            if (!remoteCmd) {
                // Handle created commands
                this_1.debug("Commands match check failed because there are new files created in the filesystem. Updating...");
                changesMade = true;
                return "break";
            }
            // Handle changed commands
            // @ts-ignore
            changesMade = !remoteCmd.equals(localCmd);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
            var localCmd = _a[_i];
            var state_1 = _loop_1(localCmd);
            if (state_1 === "break")
                break;
        }
        var _loop_2 = function (remoteCmd) {
            if (!this_2.commands.find(function (i) { return i.name === remoteCmd.name; })) {
                this_2.debug("Commands match check failed because local command files are missing from the fetched command list. Updating...");
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
    return CommandHandler;
}(BaseHandler_1.BaseHandler));
exports.CommandHandler = CommandHandler;
