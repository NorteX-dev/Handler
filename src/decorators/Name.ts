import { Command } from "../structures/Command";

export const Name = (name: string) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @Name decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "name", {
		value: name,
	});
};
