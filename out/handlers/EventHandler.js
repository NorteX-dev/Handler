"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
const Event_1 = require("../structures/Event");
const BaseHandler_1 = require("./BaseHandler");
class EventHandler extends BaseHandler_1.BaseHandler {
    constructor(options) {
        super(options);
        if (!options.client)
            throw new ReferenceError("EventHandler(): options.client is required.");
        this.client = options.client;
        if (options.autoLoad === undefined || options.autoLoad === false)
            this.loadEvents();
        return this;
    }
    loadEvents() {
        return new Promise(async (res, rej) => {
            const files = await this.load().catch(rej);
            files.forEach((event) => this.registerEvent(event));
            return res(this);
        });
    }
    registerEvent(event) {
        if (!(event instanceof Event_1.Event))
            return;
        // Verify & define defaults for optional fields
        if (!event.name) {
            throw new Error("registerEvent(): Can't register event that does not have a name. Define the event name with the @Name decorator.");
        }
        if (!event.once)
            event.once = false;
        // Define handler and client properties on class
        Object.defineProperty(event, "handler", { value: this });
        Object.defineProperty(event, "client", { value: this.client });
        this.client[event.once ? "once" : "on"](event.name, (...args) => {
            event.run(...args);
        });
        this.emit("load", event);
        this.debug(`Registered event "${event.name}".`);
        return;
    }
}
exports.EventHandler = EventHandler;
