"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Once = void 0;
const Event_1 = require("../../structures/Event");
const Once = (target) => {
    if (!(target.prototype instanceof Event_1.Event)) {
        throw new TypeError("The @Once decorator can only be used on Event classes.");
    }
    Object.defineProperty(target.prototype, "once", {
        value: true,
    });
};
exports.Once = Once;
