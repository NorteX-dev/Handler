import { Client, Interaction } from "discord.js";
import { BaseHandler } from "./BaseHandler";
import { Component } from "../structures/Component";
interface HandlerOptions {
    client: Client;
    directory?: string;
    autoLoad?: boolean;
}
export declare class ComponentHandler extends BaseHandler {
    client: Client;
    directory?: string;
    components: Component[];
    constructor(options: HandlerOptions);
    loadComponents(): Promise<unknown>;
    registerComponent(component: Component): Component;
    runComponent(interaction: Interaction, ...additionalOptions: any): Promise<Component>;
    private handleComponent;
}
export {};
