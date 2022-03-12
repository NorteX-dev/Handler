import { Component } from "../structures/Component";
export default class ComponentsStore extends Array {
    constructor();
    get size(): number;
    add(element: Component): Component;
    remove(element: Component): boolean;
    getByCid(customId: string): Component;
}
