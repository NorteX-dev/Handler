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
const CommandExecutionError_1 = require("./errors/CommandExecutionError");
const InteractionExecutionError_1 = require("./errors/InteractionExecutionError");
const discord_js_1 = require("discord.js");
class LocalUtils {
    constructor(handler, client, owners) {
        this.client = client;
        this.handler = handler;
        this.owners = owners || [];
    }
    isClass(input) {
        return typeof input === `function` && typeof input.prototype === `object` && input.toString().substr(0, 5) === `class`;
    }
    isOwner(userId) {
        if (!this.owners)
            throw new Error("isOwner(): Can't check because owners is undefined.");
        return this.owners.includes(userId);
    }
    verifyCommand(message, command, userCooldowns, guildCooldowns) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => {
                var _a;
                this.userCooldowns = userCooldowns;
                this.guildCooldowns = guildCooldowns;
                // "disabled" field
                if (command.disabled && !this.isOwner(message.author.id))
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
                    const useAfter = this.userCooldowns.get(message.author.id);
                    if (useAfter && useAfter > Date.now())
                        return res(new CommandExecutionError_1.default("User is on cooldown.", "USER_COOLDOWN"));
                    const millis = parseInt(command.userCooldown.toString()) * 1000;
                    this.userCooldowns.set(message.author.id, Date.now() + millis);
                }
                // "guildCooldowns" field
                if (command.guildCooldowns && command.guildCooldowns > 0) {
                    const useAfter = this.guildCooldowns.get(message.guild.id);
                    if (useAfter && useAfter > Date.now())
                        return res(new CommandExecutionError_1.default("Guild is on cooldown.", "GLOBAL_COOLDOWN"));
                    const millis = parseInt(command.guildCooldowns.toString()) * 1000;
                    this.guildCooldowns.set(message.guild.id, Date.now() + millis);
                }
                if (command.userPermissions && command.userPermissions.length) {
                    const userPerms = new discord_js_1.Permissions(message.channel.permissionsFor(message.member)).freeze();
                    // @ts-ignore
                    const missingUserPerms = userPerms.missing(command.userPermissions).length !== 0;
                    if (missingUserPerms)
                        return res(new CommandExecutionError_1.default("User is missing permissions.", "MISSING_USER_PERMISSIONS"));
                }
                if (command.botPermissions && command.botPermissions.length) {
                    const botPerms = new discord_js_1.Permissions(message.channel.permissionsFor(message.guild.members.cache.get((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id))).freeze();
                    // @ts-ignore
                    const missingBotPerms = botPerms.missing(command.botPermissions).length !== 0;
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
            });
        });
    }
    verifyInteraction(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => {
                var _a, _b;
                // "disabled" field
                if (interaction.disabled && !this.isOwner(interaction.user.id))
                    return res(new InteractionExecutionError_1.default("The command is disabled.", "DISABLED"));
                // "guildIds" field
                if (interaction.guildIds && ((_a = interaction.guildIds) === null || _a === void 0 ? void 0 : _a.length) && !interaction.guildIds.includes(interaction.guild.id))
                    return res(new InteractionExecutionError_1.default("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
                // "userIds" field
                if (interaction.userIds && ((_b = interaction.userIds) === null || _b === void 0 ? void 0 : _b.length) && !interaction.userIds.includes(interaction.user.id))
                    return res(new InteractionExecutionError_1.default("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
                res(undefined);
            });
        });
    }
}
exports.LocalUtils = LocalUtils;
