import { Component, QueryingMode as QueryingModeType } from "../../structures/Component";

/**
 * @deprecated Use the second parameter of @CustomID instead.
 * */
export const QueryingMode = (queryingMode: QueryingModeType) => (target: Function) => {
	if (!(target.prototype instanceof Component)) {
		throw new TypeError("The @QueryingMode decorator can only be used on Component classes.");
	}
	if (!["exact", "startsWith", "includes"].includes(queryingMode))
		throw new Error("@QueryingMode: Invalid querying mode. Valid modes are: exact, startsWith, includes.");
	Object.defineProperty(target.prototype, "queryingMode", {
		value: queryingMode,
	});
};
