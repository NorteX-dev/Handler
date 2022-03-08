"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
class Event {
    constructor(handler, filename, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = handler.client;
        this.name = options.name || filename;
        this.once = options.once || false;
    }
    run(args) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " event is not present.");
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map