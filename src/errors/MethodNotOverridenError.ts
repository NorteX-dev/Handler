class CommandDirectoryReferenceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MethodNotOverriden";
		this.message = message;
	}
}

export default CommandDirectoryReferenceError;
