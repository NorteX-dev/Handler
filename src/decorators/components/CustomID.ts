import { Component } from "../../structures/Component";

export const CustomID = (customId: string) => (target: Function) => {
	if (!(target.prototype instanceof Component)) {
		throw new TypeError("The @CustomID decorator can only be used on Component classes.");
	}
	Object.defineProperty(target.prototype, "customId", {
		value: customId,
	});
};
