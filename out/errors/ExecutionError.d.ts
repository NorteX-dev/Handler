declare class ExecutionError extends Error {
    code: string;
    private params;
    constructor(message: string, code: string, ...params: Array<any>);
}
export default ExecutionError;
