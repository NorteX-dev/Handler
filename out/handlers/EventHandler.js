"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const files = yield this.load().catch(rej);
            files.forEach((event) => this.registerEvent(event));
            return res(this);
        }));
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
