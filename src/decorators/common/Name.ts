import { Command } from "../../structures/Command";
import { Event } from "../../structures/Event";

export const Name = (name: string) => (target: Function) => {
	if (!(target.prototype instanceof Event) && !(target.prototype instanceof Command)) {
		throw new TypeError("The @Name decorator can only be used on Command and Event classes.");
	}
	Object.defineProperty(target.prototype, "name", {
		value: name,
	});
};
