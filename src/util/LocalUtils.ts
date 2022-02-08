import { Command } from "../structures/Command";
import CommandExecutionError from "../errors/CommandExecutionError";
import InteractionExecutionError from "../errors/InteractionExecutionError";
import { Client, Interaction, Permissions } from "discord.js";
import { CommandHandler } from "../handlers/CommandHandler";
import { EventHandler } from "../handlers/EventHandler";
import { InteractionHandler } from "../handlers/InteractionHandler";
import { UserContextMenuInteraction } from "../structures/UserContextMenuInteraction";
import { CommandInteraction } from "../structures/CommandInteraction";
import { MessageContextMenuInteraction } from "../structures/MessageContextMenuInteraction";
import { member } from "typedoc/dist/lib/output/themes/default/partials/member";

/**
 * @ignore
 * */
export class LocalUtils {
	private handler: CommandHandler | EventHandler | InteractionHandler;
	private client: Client;
	private userCooldowns?: Map<string, number>;
	private guildCooldowns?: Map<string, number>;
	private readonly owners: Array<string>;

	constructor(handler: CommandHandler | EventHandler | InteractionHandler, client: Client, owners?: Array<string>) {
		this.client = client;
		this.handler = handler;
		this.owners = owners || [];
	}

	isClass(input: any) {
		return typeof input === `function` && typeof input.prototype === `object` && input.toString().substring(0, 5) === `class`;
	}

	isOwner(userId: string) {
		if (!this.owners || !this.owners.length) return false;
		return this.owners.includes(userId);
	}

	async verifyCommand(message: any, command: Command, userCooldowns: Map<string, number>, guildCooldowns: Map<string, number>): Promise<CommandExecutionError | undefined> {
		return new Promise((res) => {
			this.userCooldowns = userCooldowns;
			this.guildCooldowns = guildCooldowns;
			// "disabled" field
			if (command.disabled && !this.isOwner(message.author.id)) return res(new CommandExecutionError("The command is disabled.", "DISABLED"));
			// "guildIds" field
			if (message.guild && command.guildIds && command.guildIds.length && !command.guildIds.includes(message.guild.id))
				return res(new CommandExecutionError("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED", { guildId: message.guild.id }));
			// "userIds" field
			if (command.userIds && command.userIds.length && !command.userIds.includes(message.author.id))
				return res(new CommandExecutionError("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED", { userId: message.author.id }));
			// "onlyDm" field
			if (command.onlyDm && message.channel.type !== "DM") return res(new CommandExecutionError("Command is DM only.", "COMMAND_DM_0NLY"));
			// "nsfw" field
			if (command.nsfw && !message.channel.nsfw) return res(new CommandExecutionError("Command is marked as NSFW-channels only.", "NSFW_COMMAND_USED_IN_NON_NSFW_CHANNEL"));
			// "userCooldown" field
			if (command.userCooldown && command.userCooldown > 0) {
				const useAfter = this.userCooldowns.get(message.author.id);
				if (useAfter && useAfter > Date.now())
					return res(
						new CommandExecutionError(`User is on cooldown for ${((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1)} seconds.`, "USER_COOLDOWN", {
							totalCooldown: command.userCooldown,
							remainingCooldown: (Number(useAfter || 0) - Date.now()) / 1000,
						})
					);
				const millis: number = parseInt(command.userCooldown.toString()) * 1000;
				this.userCooldowns.set(message.author.id, Date.now() + millis);
			}
			// "guildCooldowns" field
			if (command.guildCooldown && command.guildCooldown > 0) {
				const useAfter = this.guildCooldowns.get(message.guild.id);
				if (useAfter && useAfter > Date.now())
					return res(
						new CommandExecutionError(`Guild is on cooldown for ${((Number(useAfter || 0) - Date.now()) / 1000).toFixed(1)} seconds.`, "GUILD_COOLDOWN", {
							totalCooldown: command.guildCooldown,
							remainingCooldown: (Number(useAfter || 0) - Date.now()) / 1000,
						})
					);
				const millis: number = parseInt(command.guildCooldown.toString()) * 1000;
				this.guildCooldowns.set(message.guild.id, Date.now() + millis);
			}
			if (command.userPermissions && command.userPermissions.length) {
				const memberPermissions = message.channel.permissionsFor(message.member);
				const mappedPermissions = command.userPermissions.map((perm: string) => {
					// @ts-ignore
					const flag = Permissions.FLAGS[perm];
					if (!flag) return; // Ignore invalid permissions
					return flag;
				});
				if (!memberPermissions.has(mappedPermissions))
					return res(
						new CommandExecutionError("User does not have the required permissions.", "USER_PERMISSIONS_MISSING", { missingPermissions: memberPermissions.missing(mappedPermissions) })
					);
			}
			if (command.botPermissions && command.botPermissions.length) {
				const botMember = message.guild.members.cache.get(this.client.user?.id);
				const botPermissions = message.channel.permissionsFor(botMember);
				const mappedPermissions = command.botPermissions.map((perm: string) => {
					// @ts-ignore
					const flag = Permissions.FLAGS[perm];
					if (!flag) return; // Ignore invalid permissions
					return flag;
				});
				if (!botPermissions.has(mappedPermissions))
					return res(new CommandExecutionError("Bot does not have the required permissions.", "BOT_PERMISSIONS_MISSING", { missingPermissions: botPermissions.missing(mappedPermissions) }));
			}
			if (command.userRoles && command.userRoles.length) {
				// Check if user has all required roles
				const memberRoles = message.member.roles.cache;
				const mappedRoles = command.userRoles.map((role: string) => {
					const roleObj = message.guild.roles.cache.find((r: any) => r.name === role) || message.guild.roles.cache.get(role);
					if (!roleObj) return; // Ignore invalid roles
					return roleObj;
				});
				if (!memberRoles.has(mappedRoles)) return res(new CommandExecutionError("User does not have the required roles.", "USER_ROLES_MISSING"));
			}
			if (command.botRoles && command.botRoles.length) {
				// Check if bot has all required roles
				const botMember = message.guild.members.cache.get(this.client.user?.id);
				const botRoles = botMember.roles.cache;
				const mappedRoles = command.botRoles.map((role: string) => {
					const roleObj = message.guild.roles.cache.find((r: any) => r.name === role) || message.guild.roles.cache.get(role);
					if (!roleObj) return; // Ignore invalid roles
					return roleObj;
				});
				if (!botRoles.has(mappedRoles)) return res(new CommandExecutionError("Bot does not have the required roles.", "BOT_ROLES_MISSING"));
			}
			res(undefined);
		});
	}

	async verifyInteraction(
		interactionEvent: Interaction,
		interactionObject: CommandInteraction | MessageContextMenuInteraction | UserContextMenuInteraction
	): Promise<InteractionExecutionError | undefined> {
		return new Promise((res) => {
			// "disabled" field
			if (interactionObject.disabled && !this.isOwner(interactionEvent.user.id)) return res(new InteractionExecutionError("The command is disabled.", "DISABLED"));
			// "guildIds" field
			if (interactionEvent.guild && interactionObject.guildIds && interactionObject.guildIds?.length && !interactionObject.guildIds.includes(interactionEvent.guild.id))
				return res(new InteractionExecutionError("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
			// "userIds" field
			if (interactionObject.userIds && interactionObject.userIds?.length && !interactionObject.userIds.includes(interactionEvent.user.id))
				return res(new InteractionExecutionError("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
			res(undefined);
		});
	}
}
