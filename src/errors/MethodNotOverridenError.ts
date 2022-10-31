export class MethodNotOverridenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MethodNotOverriden";
		this.message = message;
	}
}
