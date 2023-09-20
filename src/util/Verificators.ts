import { ExecutionError } from "../errors/ExecutionError";
import { CommandInteraction, Permissions } from "discord.js";
import { Command } from "../structures/Command";

export default class Verificators {
	static async verifyCommand(interaction: CommandInteraction, cmd: Command): Promise<ExecutionError | undefined> {
		return new Promise((res) => {
			// "disabled" field
			if (cmd.disabled) {
				return res(new ExecutionError("The command is disabled.", "DISABLED"));
			}
			// "guildIds" field
			const guildIdInvalid = interaction.guild && cmd.guildIds && cmd.guildIds.length && !cmd.guildIds.includes(interaction.guild.id);
			if (guildIdInvalid) {
				return res(new ExecutionError("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
			}
			// "userIds" field
			if (cmd.userIds && cmd.userIds?.length && !cmd.userIds.includes(interaction.user.id)) {
				return res(new ExecutionError("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
			}
			res(undefined);
		});
	}

	static isClass(obj: any) {
		const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === "class";
		if (obj.prototype === undefined) {
			return isCtorClass;
		}
		const isPrototypeCtorClass = obj.prototype.constructor && obj.prototype.constructor.toString && obj.prototype.constructor.toString().substring(0, 5) === "class";
		return isCtorClass || isPrototypeCtorClass;
	}
}
