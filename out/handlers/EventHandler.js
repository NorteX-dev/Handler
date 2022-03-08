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
const index_1 = require("../index");
const Handler_1 = require("./Handler");
class EventHandler extends Handler_1.Handler {
    constructor(options) {
        super(options);
        if (!options.client)
            throw new ReferenceError("EventHandler(): options.client is required.");
        this.client = options.client;
        this.directory = options.directory;
        this.events = new Map();
        if (options.autoLoad === undefined)
            this.loadEvents();
        return this;
    }
    /**
     * Loads events & creates the event emitter handlers.
     *
     * @returns Promise<EventHandler>
     *
     * @remarks
     * Requires @see {@link EventHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * */
    loadEvents() {
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const files = yield this.loadAndInstance().catch(rej);
            files.forEach((event) => this.registerEvent(event));
            return res(files);
        }));
    }
    /**
     * Manually register an instanced event. This should not be needed when using loadEvents().
     *
     * @returns Command
     * */
    registerEvent(event) {
        if (!(event instanceof index_1.Event))
            throw new TypeError("registerCommand(): event parameter must be an instance of Event.");
        this.client[event.once ? "once" : "on"](event.name, (...args) => {
            event.run(...args);
        });
        this.emit("load", event);
        this.debug(`Registered command "${event.name}".`);
        return event;
    }
}
exports.EventHandler = EventHandler;
//# sourceMappingURL=EventHandler.js.map