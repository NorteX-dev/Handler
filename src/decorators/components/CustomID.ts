import { Component } from "../../structures/Component";

export enum QueryingMode {
	Exact = "exact",
	StartsWith = "startsWith",
	Includes = "includes",
}

export const CustomID =
	(customId: string, queryingMode: QueryingMode = QueryingMode.Exact) =>
	(target: Function) => {
		if (!(target.prototype instanceof Component)) {
			throw new TypeError("The @CustomID decorator can only be used on Component classes.");
		}
		Object.defineProperty(target.prototype, "customId", {
			value: customId,
		});
		Object.defineProperty(target.prototype, "queryingMode", {
			value: queryingMode,
		});
	};
