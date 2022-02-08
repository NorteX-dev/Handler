class InteractionDirectoryReferenceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InteractionDirectoryReferenceError";
		this.message = message;
	}
}

export default InteractionDirectoryReferenceError;
