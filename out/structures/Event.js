"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var Event = /** @class */ (function () {
    function Event(handler, filename, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = handler.client;
        this.name = options.name || filename;
        this.once = options.once || false;
        this.ws = options.ws || false;
    }
    Event.prototype.run = function (args) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " event is not present.");
    };
    return Event;
}());
exports.default = Event;
