"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var Event = /** @class */ (function () {
    function Event() {
    }
    Event.prototype.run = function (args) {
        throw new MethodNotOverridenError_1.MethodNotOverridenError("run() method on ".concat(this.name, " event is not present."));
    };
    return Event;
}());
exports.Event = Event;
