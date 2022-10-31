import { Command } from "../../structures/Command";

export const Disabled = (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @Disabled decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "disabled", {
		value: true,
	});
};
