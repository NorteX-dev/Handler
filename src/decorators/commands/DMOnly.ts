import { Command } from "../../structures/Command";

export const DMOnly = (target: Function) => {
	if (!(target.prototype instanceof Command)) {
		throw new TypeError("The @DMOnly decorator can only be used on Command classes.");
	}
	Object.defineProperty(target.prototype, "dmOnly", {
		value: true,
	});
};
