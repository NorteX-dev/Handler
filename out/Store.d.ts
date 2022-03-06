export default class ManagerStorage extends Array {
    constructor(...options: any[]);
    add(...args: any[]): number;
    getByName(name: string | undefined): any;
    exists(name: string): boolean;
}
