"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
class Component {
    run(interaction, additionalParams) {
        throw new MethodNotOverridenError_1.MethodNotOverridenError(`run() method on ${this.customId} interaction is not present.`);
    }
}
exports.Component = Component;
