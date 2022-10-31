import { Command } from "../../structures/Command";

export const UserIDs = (userIds: any[]) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @UserIDs decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "userIds", {
		value: userIds,
	});
};
