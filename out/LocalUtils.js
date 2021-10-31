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
exports.LocalUtils = void 0;
var CommandExecutionError_1 = require("./errors/CommandExecutionError");
var InteractionExecutionError_1 = require("./errors/InteractionExecutionError");
var discord_js_1 = require("discord.js");
var chalk = require("chalk");
var LocalUtils = /** @class */ (function () {
    function LocalUtils(client, enableDebug, owners) {
        this.client = client;
        this.enableDebug = enableDebug || false;
        this.owners = owners || [];
    }
    LocalUtils.prototype.isClass = function (input) {
        return typeof input === "function" && typeof input.prototype === "object" && input.toString().substr(0, 5) === "class";
    };
    LocalUtils.prototype.isOwner = function (userId) {
        if (!this.owners)
            throw new Error("isOwner(): Can't check because owners is undefined.");
        return this.owners.includes(userId);
    };
    LocalUtils.prototype.debug = function (message, severity) {
        if (severity === void 0) { severity = "info"; }
        if (!this.enableDebug)
            return;
        if (severity === "info")
            console.log(chalk.blue("[" + new Date().toISOString() + "]"), "Info: " + message);
        if (severity === "warn")
            console.log(chalk.yellow("[" + new Date().toISOString() + "]"), "Warn: " + message);
        if (severity === "severe")
            console.log(chalk.red("[" + new Date().toISOString() + "]"), "Severe: " + message);
    };
    LocalUtils.prototype.verifyCommand = function (message, command, userCooldowns, guildCooldowns) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        var _a;
                        _this.userCooldowns = userCooldowns;
                        _this.guildCooldowns = guildCooldowns;
                        // "disabled" field
                        if (command.disabled && !_this.isOwner(message.author.id))
                            return res(new CommandExecutionError_1.default("The command is disabled.", "DISABLED"));
                        // "guildIds" field
                        if (command.guildIds.length && !command.guildIds.includes(message.guild.id))
                            return res(new CommandExecutionError_1.default("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
                        // "userIds" field
                        if (command.userIds.length && !command.userIds.includes(message.author.id))
                            return res(new CommandExecutionError_1.default("This user ID is not whitelisted.", "USER_OD_NOT_WHITELISTED"));
                        // "onlyDm" field
                        if (command.onlyDm && message.channel.type !== "DM")
                            return res(new CommandExecutionError_1.default("Command is DM only.", "COMMAND_DM_0NLY"));
                        // "nsfw" field
                        if (command.nsfw && !message.channel.nsfw)
                            return res(new CommandExecutionError_1.default("Command is marked as NSFW-channels only.", "NSFW_COMMAND_USED_IN_NON_NSFW_CHANNEL"));
                        // "userCooldown" field
                        if (command.userCooldown && command.userCooldown > 0) {
                            var useAfter = _this.userCooldowns.get(message.author.id);
                            if (useAfter && useAfter > Date.now())
                                return res(new CommandExecutionError_1.default("User is on cooldown.", "USER_COOLDOWN"));
                            var millis = parseInt(command.userCooldown.toString()) * 1000;
                            _this.userCooldowns.set(message.author.id, Date.now() + millis);
                        }
                        // "guildCooldowns" field
                        if (command.guildCooldowns && command.guildCooldowns > 0) {
                            var useAfter = _this.guildCooldowns.get(message.guild.id);
                            if (useAfter && useAfter > Date.now())
                                return res(new CommandExecutionError_1.default("Guild is on cooldown.", "GLOBAL_COOLDOWN"));
                            var millis = parseInt(command.guildCooldowns.toString()) * 1000;
                            _this.guildCooldowns.set(message.guild.id, Date.now() + millis);
                        }
                        if (command.userPermissions && command.userPermissions.length) {
                            var userPerms = new discord_js_1.Permissions(message.channel.permissionsFor(message.member)).freeze();
                            // @ts-ignore
                            var missingUserPerms = userPerms.missing(command.userPermissions).length !== 0;
                            if (missingUserPerms)
                                return res(new CommandExecutionError_1.default("User is missing permissions.", "MISSING_USER_PERMISSIONS"));
                        }
                        if (command.botPermissions && command.botPermissions.length) {
                            var botPerms = new discord_js_1.Permissions(message.channel.permissionsFor(message.guild.members.cache.get((_a = _this.client.user) === null || _a === void 0 ? void 0 : _a.id))).freeze();
                            // @ts-ignore
                            var missingBotPerms = botPerms.missing(command.botPermissions).length !== 0;
                            if (missingBotPerms)
                                return res(new CommandExecutionError_1.default("Bot is missing permissions.", "MISSING_BOT_PERMISSIONS"));
                        }
                        // if (command.userRoles && command.userRoles.length) {
                        // 	let hasRoles = true;
                        // 	command.userRoles.map((r) => {
                        // 		if (message.member.roles.cache.has(r)) hasRoles = false;
                        // 	});
                        // 	if (hasRoles) return res(new CommandExecutionError("User is missing roles.", "MISSING_USER_ROLES"));
                        // }
                        // if (command.botRoles && command.botRoles.length) {
                        // 	let hasRoles = true; // By default think that the user has all the required role
                        // 	command.botRoles.map((r) => {
                        // 		if (!message.guild.members.cache.get(this.client.user?.id).roles.cache.has(r)) hasRoles = false; // If the user doesn't have any of these roles, mark as false
                        // 	});
                        // }
                        res(undefined);
                    })];
            });
        });
    };
    LocalUtils.prototype.verifyInteraction = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        var _a, _b;
                        // "disabled" field
                        if (interaction.disabled && !_this.isOwner(interaction.user.id))
                            return res(new InteractionExecutionError_1.default("The command is disabled.", "DISABLED"));
                        // "guildIds" field
                        if (((_a = interaction.guildIds) === null || _a === void 0 ? void 0 : _a.length) && !interaction.guildIds.includes(interaction.guild.id))
                            return res(new InteractionExecutionError_1.default("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
                        // "userIds" field
                        if (((_b = interaction.userIds) === null || _b === void 0 ? void 0 : _b.length) && !interaction.userIds.includes(interaction.user.id))
                            return res(new InteractionExecutionError_1.default("This user ID is not whitelisted.", "USER_OD_NOT_WHITELISTED"));
                        res(undefined);
                    })];
            });
        });
    };
    return LocalUtils;
}());
exports.LocalUtils = LocalUtils;
