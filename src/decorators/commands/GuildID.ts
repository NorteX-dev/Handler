import { Command } from "../../structures/Command";

export const GuildID = (guildId: string) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @GuildIDs decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "guildId", {
		value: guildId,
	});
};
