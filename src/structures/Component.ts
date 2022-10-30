import MethodNotOverridenError from "../errors/MethodNotOverridenError";

export class Component {
	async run() {
		throw new MethodNotOverridenError("run() method must be overriden.");
	}
}
