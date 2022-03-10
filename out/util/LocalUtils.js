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
exports.LocalUtils = void 0;
const ExecutionError_1 = require("../errors/ExecutionError");
const discord_js_1 = require("discord.js");
/**
 * @ignore
 * */
class LocalUtils {
    constructor() { }
    isClass(input) {
        return typeof input === `function` && typeof input.prototype === `object` && input.toString().substring(0, 5) === `class`;
    }
    isOwner(owners, userId) {
        if (!owners || !owners.length)
            return false;
        return owners.includes(userId);
    }
    verifyCommand(message, commandObject, userCooldowns, guildCooldowns) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => {
                var _a, _b;
                // "disabled" field
                if (commandObject.disabled && !this.isOwner(commandObject.handler.owners, message.author.id))
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
                    const useAfter = userCooldowns.get(message.author.id);
                    if (useAfter && useAfter > Date.now())
                        return res(new ExecutionError_1.default(`User is on cooldown for ${((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1)} seconds.`, "USER_COOLDOWN", {
                            totalCooldown: commandObject.userCooldown,
                            remainingCooldown: (Number(useAfter || 0) - Date.now()) / 1000,
                        }));
                    const millis = parseInt(commandObject.userCooldown.toString()) * 1000;
                    userCooldowns.set(message.author.id, Date.now() + millis);
                }
                // "guildCooldowns" field
                if (commandObject.guildCooldown && commandObject.guildCooldown > 0) {
                    const useAfter = guildCooldowns.get(message.guild.id);
                    if (useAfter && useAfter > Date.now())
                        return res(new ExecutionError_1.default(`Guild is on cooldown for ${((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1)} seconds.`, "GUILD_COOLDOWN", {
                            totalCooldown: commandObject.guildCooldown,
                            remainingCooldown: (Number(useAfter || 0) - Date.now()) / 1000,
                        }));
                    const millis = parseInt(commandObject.guildCooldown.toString()) * 1000;
                    guildCooldowns.set(message.guild.id, Date.now() + millis);
                }
                if (commandObject.userPermissions && commandObject.userPermissions.length) {
                    const memberPermissions = message.channel.permissionsFor(message.member);
                    const mappedPermissions = commandObject.userPermissions.map((perm) => {
                        // @ts-ignore
                        const flag = discord_js_1.Permissions.FLAGS[perm];
                        if (!flag)
                            return; // Ignore invalid permissions
                        return flag;
                    });
                    if (!memberPermissions.has(mappedPermissions))
                        return res(new ExecutionError_1.default("User does not have the required permissions.", "USER_PERMISSIONS_MISSING", { missingPermissions: memberPermissions.missing(mappedPermissions) }));
                }
                if (commandObject.botPermissions && commandObject.botPermissions.length) {
                    const botMember = message.guild.members.cache.get((_a = commandObject.client.user) === null || _a === void 0 ? void 0 : _a.id);
                    const botPermissions = message.channel.permissionsFor(botMember);
                    const mappedPermissions = commandObject.botPermissions.map((perm) => {
                        // @ts-ignore
                        const flag = discord_js_1.Permissions.FLAGS[perm];
                        if (!flag)
                            return; // Ignore invalid permissions
                        return flag;
                    });
                    if (!botPermissions.has(mappedPermissions))
                        return res(new ExecutionError_1.default("Bot does not have the required permissions.", "BOT_PERMISSIONS_MISSING", { missingPermissions: botPermissions.missing(mappedPermissions) }));
                }
                if (commandObject.userRoles && commandObject.userRoles.length) {
                    // Check if user has all required roles
                    const memberRoles = message.member.roles.cache;
                    const mappedRoles = commandObject.userRoles.map((role) => {
                        const roleObj = message.guild.roles.cache.find((r) => r.name === role) || message.guild.roles.cache.get(role);
                        if (!roleObj)
                            return; // Ignore invalid roles
                        return roleObj;
                    });
                    if (!memberRoles.has(mappedRoles))
                        return res(new ExecutionError_1.default("User does not have the required roles.", "USER_ROLES_MISSING"));
                }
                if (commandObject.botRoles && commandObject.botRoles.length) {
                    // Check if bot has all required roles
                    const botMember = message.guild.members.cache.get((_b = commandObject.client.user) === null || _b === void 0 ? void 0 : _b.id);
                    const botRoles = botMember.roles.cache;
                    const mappedRoles = commandObject.botRoles.map((role) => {
                        const roleObj = message.guild.roles.cache.find((r) => r.name === role) || message.guild.roles.cache.get(role);
                        if (!roleObj)
                            return; // Ignore invalid roles
                        return roleObj;
                    });
                    if (!botRoles.has(mappedRoles))
                        return res(new ExecutionError_1.default("Bot does not have the required roles.", "BOT_ROLES_MISSING"));
                }
                res(undefined);
            });
        });
    }
    verifyInteraction(interactionEvent, interactionObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => {
                var _a, _b;
                // "disabled" field
                if (interactionObject.disabled && !this.isOwner(interactionObject.handler.owners, interactionEvent.user.id))
                    return res(new ExecutionError_1.default("The command is disabled.", "DISABLED"));
                // "guildIds" field
                if (interactionEvent.guild && interactionObject.guildIds && ((_a = interactionObject.guildIds) === null || _a === void 0 ? void 0 : _a.length) && !interactionObject.guildIds.includes(interactionEvent.guild.id))
                    return res(new ExecutionError_1.default("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
                // "userIds" field
                if (interactionObject.userIds && ((_b = interactionObject.userIds) === null || _b === void 0 ? void 0 : _b.length) && !interactionObject.userIds.includes(interactionEvent.user.id))
                    return res(new ExecutionError_1.default("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
                res(undefined);
            });
        });
    }
}
exports.LocalUtils = LocalUtils;
