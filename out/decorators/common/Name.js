"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Name = void 0;
const Command_1 = require("../../structures/Command");
const Event_1 = require("../../structures/Event");
const Name = (name) => (target) => {
    if (!(target.prototype instanceof Event_1.Event) && !(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @Name decorator can only be used on Command and Event classes.");
    }
    Object.defineProperty(target.prototype, "name", {
        value: name,
    });
};
exports.Name = Name;
