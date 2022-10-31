import { Command } from "../../structures/Command";

export const Description = (description: string) => (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @Description decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "description", {
		value: description,
	});
};
