class CommandExecutionError extends Error {
	public code: string;
	public parameters?: any;

	constructor(message: string, code: string, parameters?: any) {
		super(message);
		this.name = "CommandExecutionError";
		this.code = code;
		this.message = message;
		this.parameters = parameters;
	}
}

export default CommandExecutionError;
