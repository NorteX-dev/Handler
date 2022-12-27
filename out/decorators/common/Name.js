"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Name = void 0;
var Command_1 = require("../../structures/Command");
var Event_1 = require("../../structures/Event");
var Name = function (name) { return function (target) {
    if (!(target.prototype instanceof Event_1.Event) && !(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @Name decorator can only be used on Command and Event classes.");
    }
    Object.defineProperty(target.prototype, "name", {
        value: name,
    });
}; };
exports.Name = Name;
