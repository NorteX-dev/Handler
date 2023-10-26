export declare class ExecutionError extends Error {
    code: string;
    params: any[];
    constructor(message: string, code: string, ...params: any[]);
}
