import { Command } from "../structures/Command";
import ExecutionError from "../errors/ExecutionError";
import { Interaction, Permissions } from "discord.js";
import { UserContextMenu } from "../structures/UserContextMenu";
import { InteractionCommand } from "../structures/InteractionCommand";
import { MessageContextMenu } from "../structures/MessageContextMenu";

/**
 * @ignore
 * */
export class LocalUtils {
	constructor() {}

	isClass(input: any) {
		return typeof input === `function` && typeof input.prototype === `object` && input.toString().substring(0, 5) === `class`;
	}

	isOwner(owners: Array<string> | undefined, userId: string) {
		if (!owners || !owners.length) return false;
		return owners.includes(userId);
	}

	async verifyCommand(message: any, commandObject: Command, userCooldowns: Map<string, number>, guildCooldowns: Map<string, number>): Promise<ExecutionError | undefined> {
		return new Promise((res) => {
			// "disabled" field
			if (commandObject.disabled && !this.isOwner(commandObject.handler.owners, message.author.id)) return res(new ExecutionError("The command is disabled.", "DISABLED"));
			// "guildIds" field
			if (message.guild && commandObject.guildIds && commandObject.guildIds.length && !commandObject.guildIds.includes(message.guild.id))
				return res(new ExecutionError("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED", { guildId: message.guild.id }));
			// "userIds" field
			if (commandObject.userIds && commandObject.userIds.length && !commandObject.userIds.includes(message.author.id))
				return res(new ExecutionError("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED", { userId: message.author.id }));
			// "onlyDm" field
			if (commandObject.onlyDm && message.channel.type !== "DM") return res(new ExecutionError("Command is DM only.", "COMMAND_DM_0NLY"));
			// "nsfw" field
			if (commandObject.nsfw && !message.channel.nsfw) return res(new ExecutionError("Command is marked as NSFW-channels only.", "NSFW_COMMAND_USED_IN_NON_NSFW_CHANNEL"));
			// "userCooldown" field
			if (commandObject.userCooldown && commandObject.userCooldown > 0) {
				const useAfter = userCooldowns.get(message.author.id);
				if (useAfter && useAfter > Date.now())
					return res(
						new ExecutionError(`User is on cooldown for ${((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1)} seconds.`, "USER_COOLDOWN", {
							totalCooldown: commandObject.userCooldown,
							remainingCooldown: (Number(useAfter || 0) - Date.now()) / 1000,
						})
					);
				const millis: number = parseInt(commandObject.userCooldown.toString()) * 1000;
				userCooldowns.set(message.author.id, Date.now() + millis);
			}
			// "guildCooldowns" field
			if (commandObject.guildCooldown && commandObject.guildCooldown > 0) {
				const useAfter = guildCooldowns.get(message.guild.id);
				if (useAfter && useAfter > Date.now())
					return res(
						new ExecutionError(`Guild is on cooldown for ${((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1)} seconds.`, "GUILD_COOLDOWN", {
							totalCooldown: commandObject.guildCooldown,
							remainingCooldown: (Number(useAfter || 0) - Date.now()) / 1000,
						})
					);
				const millis: number = parseInt(commandObject.guildCooldown.toString()) * 1000;
				guildCooldowns.set(message.guild.id, Date.now() + millis);
			}
			if (commandObject.userPermissions && commandObject.userPermissions.length) {
				const memberPermissions = message.channel.permissionsFor(message.member);
				const mappedPermissions = commandObject.userPermissions.map((perm: string) => {
					// @ts-ignore
					const flag = Permissions.FLAGS[perm];
					if (!flag) return; // Ignore invalid permissions
					return flag;
				});
				if (!memberPermissions.has(mappedPermissions))
					return res(new ExecutionError("User does not have the required permissions.", "USER_PERMISSIONS_MISSING", { missingPermissions: memberPermissions.missing(mappedPermissions) }));
			}
			if (commandObject.botPermissions && commandObject.botPermissions.length) {
				const botMember = message.guild.members.cache.get(commandObject.client.user?.id);
				const botPermissions = message.channel.permissionsFor(botMember);
				const mappedPermissions = commandObject.botPermissions.map((perm: string) => {
					// @ts-ignore
					const flag = Permissions.FLAGS[perm];
					if (!flag) return; // Ignore invalid permissions
					return flag;
				});
				if (!botPermissions.has(mappedPermissions))
					return res(new ExecutionError("Bot does not have the required permissions.", "BOT_PERMISSIONS_MISSING", { missingPermissions: botPermissions.missing(mappedPermissions) }));
			}
			if (commandObject.userRoles && commandObject.userRoles.length) {
				// Check if user has all required roles
				const memberRoles = message.member.roles.cache;
				const mappedRoles = commandObject.userRoles.map((role: string) => {
					const roleObj = message.guild.roles.cache.find((r: any) => r.name === role) || message.guild.roles.cache.get(role);
					if (!roleObj) return; // Ignore invalid roles
					return roleObj;
				});
				if (!memberRoles.has(mappedRoles)) return res(new ExecutionError("User does not have the required roles.", "USER_ROLES_MISSING"));
			}
			if (commandObject.botRoles && commandObject.botRoles.length) {
				// Check if bot has all required roles
				const botMember = message.guild.members.cache.get(commandObject.client.user?.id);
				const botRoles = botMember.roles.cache;
				const mappedRoles = commandObject.botRoles.map((role: string) => {
					const roleObj = message.guild.roles.cache.find((r: any) => r.name === role) || message.guild.roles.cache.get(role);
					if (!roleObj) return; // Ignore invalid roles
					return roleObj;
				});
				if (!botRoles.has(mappedRoles)) return res(new ExecutionError("Bot does not have the required roles.", "BOT_ROLES_MISSING"));
			}
			res(undefined);
		});
	}

	async verifyInteraction(interactionEvent: Interaction, interactionObject: InteractionCommand | MessageContextMenu | UserContextMenu): Promise<ExecutionError | undefined> {
		return new Promise((res) => {
			// "disabled" field
			if (interactionObject.disabled && !this.isOwner(interactionObject.handler.owners, interactionEvent.user.id)) return res(new ExecutionError("The command is disabled.", "DISABLED"));
			// "guildIds" field
			if (interactionEvent.guild && interactionObject.guildIds && interactionObject.guildIds?.length && !interactionObject.guildIds.includes(interactionEvent.guild.id))
				return res(new ExecutionError("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
			// "userIds" field
			if (interactionObject.userIds && interactionObject.userIds?.length && !interactionObject.userIds.includes(interactionEvent.user.id))
				return res(new ExecutionError("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
			res(undefined);
		});
	}
}
