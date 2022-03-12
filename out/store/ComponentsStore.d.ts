import { ComponentInteraction } from "../structures/ComponentInteraction";
export default class ComponentsStore extends Array {
    constructor();
    get size(): number;
    add(element: ComponentInteraction): ComponentInteraction;
    remove(element: ComponentInteraction): boolean;
    getByCid(customId: string): ComponentInteraction;
}
