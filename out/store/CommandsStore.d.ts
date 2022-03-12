import { Command } from "../structures/Command";
export default class CommandsStore extends Array {
    constructor();
    get size(): number;
    add(element: Command): Command;
    remove(element: Command): boolean;
    get(name: string): Command;
}
