import { Component } from "../structures/Component";

export default class ComponentsStore extends Array {
	constructor() {
		super();
	}

	get size() {
		return this.length;
	}

	public add(element: Component): Component {
		this.push(element);
		return element;
	}

	public remove(element: Component): boolean {
		if (this.indexOf(element) === -1) return false;
		this.splice(this.indexOf(element), 1);
		return true;
	}

	public getByCid(customId: string): Component {
		return this.find((e) => e.customId === customId);
	}
}
