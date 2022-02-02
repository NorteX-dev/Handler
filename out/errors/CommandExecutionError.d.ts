declare class CommandExecutionError extends Error {
    code: string;
    parameters?: any;
    constructor(message: string, code: string, parameters?: any);
}
export default CommandExecutionError;
