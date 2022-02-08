class InteractionExecutionError extends Error {
	public code: string;
	constructor(message: string, code: string) {
		super(message);
		this.name = "InteractionExecutionError";
		this.code = code;
		this.message = message;
	}
}

export default InteractionExecutionError;
