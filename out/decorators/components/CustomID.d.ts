export declare enum QueryingMode {
    Exact = "exact",
    StartsWith = "startsWith",
    Includes = "includes"
}
export declare const CustomID: (customId: string, queryingMode?: QueryingMode) => (target: Function) => void;
