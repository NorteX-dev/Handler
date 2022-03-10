import { InteractionCommand } from "../structures/InteractionCommand";
import { MessageContextMenu } from "../structures/MessageContextMenu";
import { UserContextMenu } from "../structures/UserContextMenu";

type InteractionClass = InteractionCommand | MessageContextMenu | UserContextMenu;

export default class InteractionsStore extends Array {
	constructor() {
		super();
	}

	get size() {
		return this.length;
	}

	public add(element: InteractionClass): InteractionClass {
		this.push(element);
		return element;
	}

	public remove(element: InteractionClass): boolean {
		if (this.indexOf(element) === -1) return false;
		this.splice(this.indexOf(element), 1);
		return true;
	}

	public getByName(name: string): InteractionClass {
		return this.find((e) => e.name === name);
	}

	public getByNameAndType(name: string, type: "CHAT_INPUT" | "USER" | "MESSAGE") {
		return this.find((e) => e.name === name && e.type === type);
	}
}
