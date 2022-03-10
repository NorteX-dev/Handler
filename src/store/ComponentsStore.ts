import { ComponentInteraction } from "../structures/ComponentInteraction";

export default class ComponentsStore extends Array {
	constructor() {
		super();
	}

	get size() {
		return this.length;
	}

	public add(element: ComponentInteraction): ComponentInteraction {
		this.push(element);
		return element;
	}

	public remove(element: ComponentInteraction): boolean {
		if (this.indexOf(element) === -1) return false;
		this.splice(this.indexOf(element), 1);
		return true;
	}

	public getByCid(customId: string): ComponentInteraction {
		return this.find((e) => e.customId === customId);
	}
}
