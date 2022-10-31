import { Command } from "../../structures/Command";

export const GuildIDs = (guildIds: any[]) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @GuildIDs decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "guildIds", {
		value: guildIds,
	});
};
