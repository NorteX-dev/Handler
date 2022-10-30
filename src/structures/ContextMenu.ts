import MethodNotOverridenError from "../errors/MethodNotOverridenError";

export class ContextMenu {
	async run() {
		throw new MethodNotOverridenError("run() method must be overriden.");
	}
}
