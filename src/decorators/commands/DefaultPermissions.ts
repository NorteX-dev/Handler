import { Command } from "../../structures/Command";

export const DefaultPermissions = (defaultPermissions: any[]) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @DefaultPermissions decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "defaultPermissions", {
		value: defaultPermissions,
	});
};
