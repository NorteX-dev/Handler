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
var ExecutionError_1 = require("../errors/ExecutionError");
var discord_js_1 = require("discord.js");
var Handler_1 = require("./Handler");
var Command_1 = require("../structures/Command");
var Verificators_1 = require("../util/Verificators");
var CommandHandler = /** @class */ (function (_super) {
    __extends(CommandHandler, _super);
    function CommandHandler(options) {
        var _a;
        var _this = _super.call(this, options) || this;
        _this.owners = options.owners || [];
        _this.commands = [];
        _this.aliases = new Map();
        _this.userCooldowns = new Map();
        _this.guildCooldowns = new Map();
        _this.setPrefix((_a = options.prefix) !== null && _a !== void 0 ? _a : "?");
        if (options.autoLoad === undefined || options.autoLoad === false)
            _this.loadCommands();
        return _this;
    }
    /**
     * Sets a prefix
     *
     * @param prefix Prefix to set
     *
     * @returns CommandHandler
     * */
    CommandHandler.prototype.setPrefix = function (prefix) {
        if (prefix === undefined)
            throw new ReferenceError("setPrefix(): prefix parameter is required as a string or string[].");
        if (typeof prefix === "string")
            prefix = [prefix];
        this.prefix = prefix;
        return this;
    };
    /**
     * Loads classic message commands into memory
     *
     * @returns Command[]
     *
     * @remarks
     * Requires @see {@link CommandHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * */
    CommandHandler.prototype.loadCommands = function () {
        var _this = this;
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load().catch(rej)];
                    case 1:
                        files = _a.sent();
                        files.forEach(function (cmd) { return _this.registerCommand(cmd); });
                        return [2 /*return*/, res(this.commands)];
                }
            });
        }); });
    };
    /**
     * Manually register an instanced command. This should not be needed when using loadCommands().
     *
     * @returns Command
     * */
    CommandHandler.prototype.registerCommand = function (command) {
        var _this = this;
        if (!(command instanceof Command_1.default))
            throw new TypeError("registerCommand(): command parameter is not an instance of Command.");
        if (this.commands.find(function (c) { return c.name === command.name; }))
            throw new Error("Command ".concat(command.name, " cannot be registered twice."));
        this.commands.push(command);
        if (command.aliases && command.aliases.length)
            command.aliases.forEach(function (alias) { return _this.aliases.set(alias, command.name); });
        this.emit("load", command);
        this.debug("Registered command \"".concat(command.name, "\"."));
        return command;
    };
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<Command>
     * */
    CommandHandler.prototype.runCommand = function (message) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var prefixes, _loop_1, this_1, _i, prefixes_1, prefix, state_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!message.partial) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.fetch()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        prefixes = this.prefix;
                        if (!prefixes || !prefixes.length)
                            prefixes = ["?"];
                        _loop_1 = function (prefix) {
                            var _b, typedCommand, args, command, failedReason;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!message.content.startsWith(prefix))
                                            return [2 /*return*/, "continue"];
                                        _b = message.content.slice(prefix.length).trim().split(/ +/g), typedCommand = _b[0], args = _b.slice(1);
                                        if (!typedCommand)
                                            return [2 /*return*/, { value: void 0 }];
                                        typedCommand = typedCommand.trim();
                                        command = this_1.commands.find(function (c) { return c.name === typedCommand.toLowerCase(); }) ||
                                            this_1.commands.find(function (c) { return c.name === _this.aliases.get(typedCommand.toLowerCase()); });
                                        if (!command)
                                            return [2 /*return*/, { value: reject(new ExecutionError_1.default("Command not found.", "COMMAND_NOT_FOUND", { query: typedCommand })) }];
                                        if (!(command instanceof Command_1.default))
                                            return [2 /*return*/, { value: reject(new ExecutionError_1.default("Attempting to run non-command class with runCommand().", "INVALID_CLASS")) }];
                                        // Handle additional command parameters
                                        if (!command.allowDm && message.channel.type === "DM")
                                            return [2 /*return*/, { value: reject(new ExecutionError_1.default("Command cannot be executed in DM.", "COMMAND_NOT_ALLOWED_IN_DM", { command: command })) }];
                                        return [4 /*yield*/, Verificators_1.default.verifyCommand(message, command, this_1.userCooldowns, this_1.guildCooldowns)];
                                    case 1:
                                        failedReason = _c.sent();
                                        if (failedReason) {
                                            reject(failedReason);
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        if (command.usage)
                                            command.usage = "".concat(prefix).concat(command.name, " ").concat(command.usage) || "";
                                        return [4 /*yield*/, CommandHandler.evaluateParameters(message, command, args)];
                                    case 2:
                                        // Evaluate parameters
                                        args = _c.sent();
                                        try {
                                            command.run.apply(command, __spreadArray([message, args], additionalOptions, false));
                                            resolve(command);
                                        }
                                        catch (ex) {
                                            console.error(ex);
                                            reject(ex);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, prefixes_1 = prefixes;
                        _a.label = 3;
                    case 3:
                        if (!(_i < prefixes_1.length)) return [3 /*break*/, 6];
                        prefix = prefixes_1[_i];
                        return [5 /*yield**/, _loop_1(prefix)];
                    case 4:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Evaluate parameters.
     *
     * @ignore
     * */
    CommandHandler.evaluateParameters = function (message, command, args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, i, parameter, value, prompt_1, _c, response, responseMessage, isValid, result;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!command.parameters.length)
                            return [2 /*return*/, args];
                        _a = [];
                        for (_b in command.parameters)
                            _a.push(_b);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 15];
                        i = _a[_i];
                        parameter = command.parameters[i];
                        value = undefined;
                        if (!(!args[i] && parameter.required)) return [3 /*break*/, 9];
                        // Parameter is required and not provided
                        if (parameter.onMissing)
                            parameter.onMissing(parameter, command, message, args);
                        if (!parameter.prompt) return [3 /*break*/, 8];
                        if (!(typeof parameter.prompt.message === "string")) return [3 /*break*/, 3];
                        return [4 /*yield*/, message.channel.send({
                                content: parameter.prompt.message,
                            })];
                    case 2:
                        _c = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = parameter.prompt.message(parameter, command, message, args);
                        _d.label = 4;
                    case 4:
                        prompt_1 = _c;
                        if (!prompt_1 || !(prompt_1 instanceof discord_js_1.Message))
                            throw new Error("".concat(command.name, ": Parameter.prompt.message() in parameter: '").concat(parameter.name, "' did not return a Message instance."));
                        return [4 /*yield*/, message.channel.awaitMessages({
                                filter: function (m) { return m.author.id === message.author.id; },
                                max: 1,
                                time: parameter.prompt.timeout || 30000,
                                errors: ["time"],
                            })];
                    case 5:
                        response = _d.sent();
                        if (!response.size) {
                            if (parameter.prompt.onTimeout)
                                parameter.prompt.onTimeout(parameter, command, message, args);
                            return [3 /*break*/, 14];
                        }
                        responseMessage = response.first();
                        if (!responseMessage) {
                            // Possibly redundant but shuts up TS
                            if (parameter.prompt.onTimeout)
                                parameter.prompt.onTimeout(parameter, command, message, args);
                            return [3 /*break*/, 14];
                        }
                        return [4 /*yield*/, prompt_1.delete().catch(function () {
                                /*ignore problems related to deleting since they don't affect anything*/
                            })];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, responseMessage.delete().catch(function () {
                                /*ignore problems related to deleting since they don't affect anything*/
                            })];
                    case 7:
                        _d.sent();
                        value = responseMessage.content;
                        return [3 /*break*/, 9];
                    case 8: return [3 /*break*/, 14];
                    case 9:
                        // Parameter is specified or it's not but it's not required
                        value = value || args[i];
                        if (!parameter.validator) return [3 /*break*/, 11];
                        return [4 /*yield*/, parameter.validator(value, parameter, command, message, args)];
                    case 10:
                        isValid = _d.sent();
                        if (!isValid) {
                            if (parameter.onInvalid)
                                parameter.onInvalid(parameter, command, message, args);
                            return [3 /*break*/, 14];
                        }
                        _d.label = 11;
                    case 11:
                        if (!parameter.transform) return [3 /*break*/, 13];
                        return [4 /*yield*/, parameter.transform(value, parameter, command, message, args)];
                    case 12:
                        result = _d.sent();
                        if (result)
                            args[i] = result;
                        return [3 /*break*/, 14];
                    case 13:
                        args[i] = value;
                        _d.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 1];
                    case 15: return [2 /*return*/, args];
                }
            });
        });
    };
    return CommandHandler;
}(Handler_1.default));
exports.default = CommandHandler;
