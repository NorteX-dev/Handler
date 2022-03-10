import { Command } from "../structures/Command";

export default class CommandsStore extends Array {
	constructor() {
		super();
	}

	get size() {
		return this.length;
	}

	public add(element: Command): Command {
		this.push(element);
		return element;
	}

	public remove(element: Command): boolean {
		if (this.indexOf(element) === -1) return false;
		this.splice(this.indexOf(element), 1);
		return true;
	}

	public get(name: string): Command {
		return this.find((e) => e.name === name);
	}
}
