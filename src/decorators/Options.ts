import { Command } from "../structures/Command";

export const Options = (options: any[]) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @Description decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "options", {
		value: options,
	});
};
