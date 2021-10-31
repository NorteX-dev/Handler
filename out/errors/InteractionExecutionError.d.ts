declare class InteractionExecutionError extends Error {
    code: string;
    constructor(message: string, code: string);
}
export default InteractionExecutionError;
