class EventDirectoryReferenceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EventDirectoryReferenceError";
		this.message = message;
	}
}

export default EventDirectoryReferenceError;
