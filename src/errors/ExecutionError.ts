class ExecutionError extends Error {
	public code: string;
	private params: Array<any>;
	constructor(message: string, code: string, ...params: Array<any>) {
		super(message);
		this.name = "InteractionExecutionError";
		this.code = code;
		this.message = message;
		this.params = params;
	}
}

export default ExecutionError;
