import { Command } from "../structures/Command";
export default class CommandsStore extends Array {
    get(name: string): Command;
    add(element: Command): Command;
    remove(element: Command): boolean;
    get size(): number;
}
