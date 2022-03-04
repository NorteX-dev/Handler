class DirectoryReferenceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DirectoryReference";
		this.message = message;
	}
}

export default DirectoryReferenceError;
