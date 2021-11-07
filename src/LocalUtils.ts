import { Command } from "./Command";
import CommandExecutionError from "./errors/CommandExecutionError";
import InteractionExecutionError from "./errors/InteractionExecutionError";
import { Client, Permissions } from "discord.js";
import { CommandHandler } from "./CommandHandler";
import { EventHandler } from "./EventHandler";
import { InteractionHandler } from "./InteractionHandler";

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
		return typeof input === `function` && typeof input.prototype === `object` && input.toString().substr(0, 5) === `class`;
	}

	isOwner(userId: string) {
		if (!this.owners) throw new Error("isOwner(): Can't check because owners is undefined.");
		return this.owners.includes(userId);
	}

	debug(message: string) {
		this.handler.emit("debug", message);
	}

	async verifyCommand(message: any, command: Command, userCooldowns: Map<string, number>, guildCooldowns: Map<string, number>): Promise<CommandExecutionError | undefined> {
		return new Promise((res) => {
			this.userCooldowns = userCooldowns;
			this.guildCooldowns = guildCooldowns;
			// "disabled" field
			if (command.disabled && !this.isOwner(message.author.id)) return res(new CommandExecutionError("The command is disabled.", "DISABLED"));
			// "guildIds" field
			if (command.guildIds!.length && !command.guildIds.includes(message!.guild.id)) return res(new CommandExecutionError("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
			// "userIds" field
			if (command.userIds!.length && !command.userIds.includes(message.author.id)) return res(new CommandExecutionError("This user ID is not whitelisted.", "USER_OD_NOT_WHITELISTED"));
			// "onlyDm" field
			if (command.onlyDm && message.channel.type !== "DM") return res(new CommandExecutionError("Command is DM only.", "COMMAND_DM_0NLY"));
			// "nsfw" field
			if (command.nsfw && !message.channel.nsfw) return res(new CommandExecutionError("Command is marked as NSFW-channels only.", "NSFW_COMMAND_USED_IN_NON_NSFW_CHANNEL"));
			// "userCooldown" field
			if (command.userCooldown && command.userCooldown > 0) {
				const useAfter = this.userCooldowns.get(message.author.id);
				if (useAfter && useAfter > Date.now()) return res(new CommandExecutionError("User is on cooldown.", "USER_COOLDOWN"));
				const millis: number = parseInt(command.userCooldown.toString()) * 1000;
				this.userCooldowns.set(message.author.id, Date.now() + millis);
			}
			// "guildCooldowns" field
			if (command.guildCooldowns && command.guildCooldowns > 0) {
				const useAfter = this.guildCooldowns.get(message.guild.id);
				if (useAfter && useAfter > Date.now()) return res(new CommandExecutionError("Guild is on cooldown.", "GLOBAL_COOLDOWN"));
				const millis: number = parseInt(command.guildCooldowns.toString()) * 1000;
				this.guildCooldowns.set(message.guild.id, Date.now() + millis);
			}
			if (command.userPermissions && command.userPermissions.length) {
				const userPerms = new Permissions(message.channel.permissionsFor(message.member)).freeze();
				// @ts-ignore
				const missingUserPerms = userPerms.missing(command.userPermissions).length !== 0;
				if (missingUserPerms) return res(new CommandExecutionError("User is missing permissions.", "MISSING_USER_PERMISSIONS"));
			}
			if (command.botPermissions && command.botPermissions.length) {
				const botPerms = new Permissions(message.channel.permissionsFor(message.guild.members.cache.get(this.client.user?.id))).freeze();
				// @ts-ignore
				const missingBotPerms = botPerms.missing(command.botPermissions).length !== 0;
				if (missingBotPerms) return res(new CommandExecutionError("Bot is missing permissions.", "MISSING_BOT_PERMISSIONS"));
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
	}

	async verifyInteraction(interaction: any): Promise<InteractionExecutionError | undefined> {
		return new Promise((res) => {
			// "disabled" field
			if (interaction.disabled && !this.isOwner(interaction.user.id)) return res(new InteractionExecutionError("The command is disabled.", "DISABLED"));
			// "guildIds" field
			if (interaction.guildIds?.length && !interaction.guildIds.includes(interaction!.guild.id))
				return res(new InteractionExecutionError("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
			// "userIds" field
			if (interaction.userIds?.length && !interaction.userIds.includes(interaction.user.id))
				return res(new InteractionExecutionError("This user ID is not whitelisted.", "USER_OD_NOT_WHITELISTED"));
			res(undefined);
		});
	}
}
