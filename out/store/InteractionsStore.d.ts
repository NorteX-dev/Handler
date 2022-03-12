import { InteractionCommand } from "../structures/InteractionCommand";
import { MessageContextMenu } from "../structures/MessageContextMenu";
import { UserContextMenu } from "../structures/UserContextMenu";
declare type InteractionClass = InteractionCommand | MessageContextMenu | UserContextMenu;
export default class InteractionsStore extends Array {
    constructor();
    get size(): number;
    add(element: InteractionClass): InteractionClass;
    remove(element: InteractionClass): boolean;
    getByName(name: string): InteractionClass;
    getByNameAndType(name: string, type: "CHAT_INPUT" | "USER" | "MESSAGE"): any;
}
export {};
