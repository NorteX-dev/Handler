class CommandExecutionError extends Error {
	public code: string;
	constructor(message: string, code: string) {
		super(message);
		this.name = "CommandExecutionError";
		this.code = code;
		this.message = message;
	}
}

export default CommandExecutionError;
