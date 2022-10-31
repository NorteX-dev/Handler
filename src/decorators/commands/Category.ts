import { Command } from "../../structures/Command";

export const Category = (category: string) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @Category decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "category", {
		value: category,
	});
};
