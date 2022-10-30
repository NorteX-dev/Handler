import { Command } from "../structures/Command";

export const GuildOnly = (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @GuildOnly decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "guildOnly", {
		value: true,
	});
};
