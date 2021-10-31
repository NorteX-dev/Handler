declare class CommandExecutionError extends Error {
    code: string;
    constructor(message: string, code: string);
}
export default CommandExecutionError;
