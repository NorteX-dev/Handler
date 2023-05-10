import { Command } from "../../structures/Command";

export const DefaultMemberPermissions = (bitfield: string | undefined) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @DefaultMemberPermissions decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "defaultMemberPermissions", {
		value: bitfield,
	});
};
