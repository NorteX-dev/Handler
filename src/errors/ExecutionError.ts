export class ExecutionError extends Error {
	public code: string;
	public params: any[];

	constructor(message: string, code: string, ...params: any[]) {
		super(message);
		this.name = "ExecutionError";
		this.code = code;
		this.message = message;
		this.params = params;
	}
}
