import { Event } from "../../structures/Event";

export const Once = (target: Function) => {
	if (!(target.prototype instanceof Event)) {
		throw new TypeError("The @Once decorator can only be used on Event classes.");
	}
	Object.defineProperty(target.prototype, "once", {
		value: true,
	});
};
