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
var ExecutionError_1 = require("../errors/ExecutionError");
var discord_js_1 = require("discord.js");
/**
 * @ignore
 * */
var Verificators = /** @class */ (function () {
    function Verificators() {
    }
    Verificators.isClass = function (input) {
        return typeof input === "function" && typeof input.prototype === "object" && input.toString().substring(0, 5) === "class";
    };
    Verificators.isOwner = function (owners, userId) {
        if (!owners || !owners.length)
            return false;
        return owners.includes(userId);
    };
    Verificators.verifyCommand = function (message, commandObject, userCooldowns, guildCooldowns) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        var _a, _b;
                        // "disabled" field
                        if (commandObject.disabled && !_this.isOwner(commandObject.handler.owners, message.author.id))
                            return res(new ExecutionError_1.default("The command is disabled.", "DISABLED"));
                        // "guildIds" field
                        if (message.guild && commandObject.guildIds && commandObject.guildIds.length && !commandObject.guildIds.includes(message.guild.id))
                            return res(new ExecutionError_1.default("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED", { guildId: message.guild.id }));
                        // "userIds" field
                        if (commandObject.userIds && commandObject.userIds.length && !commandObject.userIds.includes(message.author.id))
                            return res(new ExecutionError_1.default("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED", { userId: message.author.id }));
                        // "onlyDm" field
                        if (commandObject.onlyDm && message.channel.type !== "DM")
                            return res(new ExecutionError_1.default("Command is DM only.", "COMMAND_DM_0NLY"));
                        // "nsfw" field
                        if (commandObject.nsfw && !message.channel.nsfw)
                            return res(new ExecutionError_1.default("Command is marked as NSFW-channels only.", "NSFW_COMMAND_USED_IN_NON_NSFW_CHANNEL"));
                        // "userCooldown" field
                        if (commandObject.userCooldown && commandObject.userCooldown > 0) {
                            var useAfter = userCooldowns.get(message.author.id);
                            if (useAfter && useAfter > Date.now())
                                return res(new ExecutionError_1.default("User is on cooldown for ".concat(((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1), " seconds."), "USER_COOLDOWN", {
                                    totalCooldown: commandObject.userCooldown,
                                    remainingCooldown: (Number(useAfter || 0) - Date.now()) / 1000,
                                }));
                            var millis = parseInt(commandObject.userCooldown.toString()) * 1000;
                            userCooldowns.set(message.author.id, Date.now() + millis);
                        }
                        // "guildCooldowns" field
                        if (commandObject.guildCooldown && commandObject.guildCooldown > 0) {
                            var useAfter = guildCooldowns.get(message.guild.id);
                            if (useAfter && useAfter > Date.now())
                                return res(new ExecutionError_1.default("Guild is on cooldown for ".concat(((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1), " seconds."), "GUILD_COOLDOWN", {
                                    totalCooldown: commandObject.guildCooldown,
                                    remainingCooldown: (Number(useAfter || 0) - Date.now()) / 1000,
                                }));
                            var millis = parseInt(commandObject.guildCooldown.toString()) * 1000;
                            guildCooldowns.set(message.guild.id, Date.now() + millis);
                        }
                        if (commandObject.userPermissions && commandObject.userPermissions.length) {
                            var memberPermissions = message.channel.permissionsFor(message.member);
                            var mappedPermissions = commandObject.userPermissions.map(function (perm) {
                                // @ts-ignore
                                var flag = discord_js_1.Permissions.FLAGS[perm];
                                if (!flag)
                                    return; // Ignore invalid permissions
                                return flag;
                            });
                            if (!memberPermissions.has(mappedPermissions))
                                return res(new ExecutionError_1.default("User does not have the required permissions.", "USER_PERMISSIONS_MISSING", {
                                    missingPermissions: memberPermissions.missing(mappedPermissions),
                                }));
                        }
                        if (commandObject.botPermissions && commandObject.botPermissions.length) {
                            var botMember = message.guild.members.cache.get((_a = commandObject.client.user) === null || _a === void 0 ? void 0 : _a.id);
                            var botPermissions = message.channel.permissionsFor(botMember);
                            var mappedPermissions = commandObject.botPermissions.map(function (perm) {
                                // @ts-ignore
                                var flag = discord_js_1.Permissions.FLAGS[perm];
                                if (!flag)
                                    return; // Ignore invalid permissions
                                return flag;
                            });
                            if (!botPermissions.has(mappedPermissions))
                                return res(new ExecutionError_1.default("Bot does not have the required permissions.", "BOT_PERMISSIONS_MISSING", {
                                    missingPermissions: botPermissions.missing(mappedPermissions),
                                }));
                        }
                        if (commandObject.userRoles && commandObject.userRoles.length) {
                            // Check if user has all required roles
                            var memberRoles = message.member.roles.cache;
                            var mappedRoles = commandObject.userRoles.map(function (role) {
                                var roleObj = message.guild.roles.cache.find(function (r) { return r.name === role; }) || message.guild.roles.cache.get(role);
                                if (!roleObj)
                                    return; // Ignore invalid roles
                                return roleObj;
                            });
                            if (!memberRoles.has(mappedRoles))
                                return res(new ExecutionError_1.default("User does not have the required roles.", "USER_ROLES_MISSING"));
                        }
                        if (commandObject.botRoles && commandObject.botRoles.length) {
                            // Check if bot has all required roles
                            var botMember = message.guild.members.cache.get((_b = commandObject.client.user) === null || _b === void 0 ? void 0 : _b.id);
                            var botRoles = botMember.roles.cache;
                            var mappedRoles = commandObject.botRoles.map(function (role) {
                                var roleObj = message.guild.roles.cache.find(function (r) { return r.name === role; }) || message.guild.roles.cache.get(role);
                                if (!roleObj)
                                    return; // Ignore invalid roles
                                return roleObj;
                            });
                            if (!botRoles.has(mappedRoles))
                                return res(new ExecutionError_1.default("Bot does not have the required roles.", "BOT_ROLES_MISSING"));
                        }
                        res(undefined);
                    })];
            });
        });
    };
    Verificators.verifyInteraction = function (interactionEvent, interactionObject) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        var _a, _b;
                        // "disabled" field
                        if (interactionObject.disabled && !_this.isOwner(interactionObject.handler.owners, interactionEvent.user.id))
                            return res(new ExecutionError_1.default("The command is disabled.", "DISABLED"));
                        // "guildIds" field
                        if (interactionEvent.guild &&
                            interactionObject.guildIds &&
                            ((_a = interactionObject.guildIds) === null || _a === void 0 ? void 0 : _a.length) &&
                            !interactionObject.guildIds.includes(interactionEvent.guild.id))
                            return res(new ExecutionError_1.default("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
                        // "userIds" field
                        if (interactionObject.userIds && ((_b = interactionObject.userIds) === null || _b === void 0 ? void 0 : _b.length) && !interactionObject.userIds.includes(interactionEvent.user.id))
                            return res(new ExecutionError_1.default("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
                        res(undefined);
                    })];
            });
        });
    };
    return Verificators;
}());
exports.default = Verificators;
