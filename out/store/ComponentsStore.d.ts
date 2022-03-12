import { Component } from "../structures/Component";
export default class ComponentsStore extends Array {
    constructor();
    get(customId: string): Component;
    add(element: Component): Component;
    remove(element: Component): boolean;
    get size(): number;
}
