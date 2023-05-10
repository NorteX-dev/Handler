"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
class Event {
    run(args) {
        throw new MethodNotOverridenError_1.MethodNotOverridenError(`run() method on ${this.name} event is not present.`);
    }
}
exports.Event = Event;
