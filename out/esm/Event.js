"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
var MethodNotOverridenError_1 = require("./errors/MethodNotOverridenError");
var Event = /** @class */ (function () {
    function Event(handler, client, name, options) {
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.name = options.name || name;
        this.once = options.once || false;
    }
    Event.prototype.run = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " event is not present.");
    };
    return Event;
}());
exports.Event = Event;
