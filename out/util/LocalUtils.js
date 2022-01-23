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
var CommandExecutionError_1 = require("../errors/CommandExecutionError");
var InteractionExecutionError_1 = require("../errors/InteractionExecutionError");
var discord_js_1 = require("discord.js");
/**
 * @ignore
 * */
var LocalUtils = /** @class */ (function () {
    function LocalUtils(handler, client, owners) {
        this.client = client;
        this.handler = handler;
        this.owners = owners || [];
    }
    LocalUtils.prototype.isClass = function (input) {
        return typeof input === "function" && typeof input.prototype === "object" && input.toString().substring(0, 5) === "class";
    };
    LocalUtils.prototype.isOwner = function (userId) {
        if (!this.owners)
            throw new Error("isOwner(): Can't check because owners is undefined.");
        return this.owners.includes(userId);
    };
    LocalUtils.prototype.verifyCommand = function (message, command, userCooldowns, guildCooldowns) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        var _a, _b;
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
                                return res(new CommandExecutionError_1.default("User is on cooldown for ".concat(((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1), " seconds."), "USER_COOLDOWN"));
                            var millis = parseInt(command.userCooldown.toString()) * 1000;
                            _this.userCooldowns.set(message.author.id, Date.now() + millis);
                        }
                        // "guildCooldowns" field
                        if (command.guildCooldown && command.guildCooldown > 0) {
                            var useAfter = _this.guildCooldowns.get(message.guild.id);
                            if (useAfter && useAfter > Date.now())
                                return res(new CommandExecutionError_1.default("Guild is on cooldown for ".concat(((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1), " seconds."), "GLOBAL_COOLDOWN"));
                            var millis = parseInt(command.guildCooldown.toString()) * 1000;
                            _this.guildCooldowns.set(message.guild.id, Date.now() + millis);
                        }
                        if (command.userPermissions && command.userPermissions.length) {
                            var memberPermissions = message.channel.permissionsFor(message.member);
                            var mappedPermissions = command.userPermissions.map(function (perm) {
                                // @ts-ignore
                                var flag = discord_js_1.Permissions.FLAGS[perm];
                                if (!flag)
                                    return; // Ignore invalid permissions
                                return flag;
                            });
                            if (!memberPermissions.has(mappedPermissions))
                                return res(new CommandExecutionError_1.default("User does not have the required permissions.", "USER_PERMISSIONS_MISSING"));
                        }
                        if (command.botPermissions && command.botPermissions.length) {
                            var botMember = message.guild.members.cache.get((_a = _this.client.user) === null || _a === void 0 ? void 0 : _a.id);
                            var botPermissions = message.channel.permissionsFor(botMember);
                            var mappedPermissions = command.botPermissions.map(function (perm) {
                                // @ts-ignore
                                var flag = discord_js_1.Permissions.FLAGS[perm];
                                if (!flag)
                                    return; // Ignore invalid permissions
                                return flag;
                            });
                            if (!botPermissions.has(mappedPermissions))
                                return res(new CommandExecutionError_1.default("Bot does not have the required permissions.", "BOT_PERMISSIONS_MISSING"));
                        }
                        if (command.userRoles && command.userRoles.length) {
                            // Check if user has all required roles
                            var memberRoles = message.member.roles.cache;
                            var mappedRoles = command.userRoles.map(function (role) {
                                var roleObj = message.guild.roles.cache.find(function (r) { return r.name === role; }) || message.guild.roles.cache.get(role);
                                if (!roleObj)
                                    return; // Ignore invalid roles
                                return roleObj;
                            });
                            if (!memberRoles.has(mappedRoles))
                                return res(new CommandExecutionError_1.default("User does not have the required roles.", "USER_ROLES_MISSING"));
                        }
                        if (command.botRoles && command.botRoles.length) {
                            // Check if bot has all required roles
                            var botMember = message.guild.members.cache.get((_b = _this.client.user) === null || _b === void 0 ? void 0 : _b.id);
                            var botRoles = botMember.roles.cache;
                            var mappedRoles = command.botRoles.map(function (role) {
                                var roleObj = message.guild.roles.cache.find(function (r) { return r.name === role; }) || message.guild.roles.cache.get(role);
                                if (!roleObj)
                                    return; // Ignore invalid roles
                                return roleObj;
                            });
                            if (!botRoles.has(mappedRoles))
                                return res(new CommandExecutionError_1.default("Bot does not have the required roles.", "BOT_ROLES_MISSING"));
                        }
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
                        if (interaction.guildIds && ((_a = interaction.guildIds) === null || _a === void 0 ? void 0 : _a.length) && !interaction.guildIds.includes(interaction.guild.id))
                            return res(new InteractionExecutionError_1.default("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
                        // "userIds" field
                        if (interaction.userIds && ((_b = interaction.userIds) === null || _b === void 0 ? void 0 : _b.length) && !interaction.userIds.includes(interaction.user.id))
                            return res(new InteractionExecutionError_1.default("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
                        res(undefined);
                    })];
            });
        });
    };
    return LocalUtils;
}());
exports.LocalUtils = LocalUtils;
