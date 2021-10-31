class CommandDirectoryReferenceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CommandDirectoryReference";
		this.message = message;
	}
}

export default CommandDirectoryReferenceError;
