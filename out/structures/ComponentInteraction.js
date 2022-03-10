"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentInteraction = void 0;
const MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
class ComponentInteraction {
    constructor(handler, filename, options) {
        if (!options)
            options = {};
        if (!options.customId)
            throw new Error(`ComponentInteraction (${filename}): customId is required.`);
        if (!options.queryingMode)
            options.queryingMode = "exact";
        if (!["exact", "includes", "startsWith"].includes(options.queryingMode))
            throw new Error(filename + ": Invalid querying mode for component interaction. Querying mode must be one of: exact, includes, startsWith.");
        this.handler = handler;
        this.client = handler.client;
        this.type = "COMPONENT";
        this.customId = options.customId;
        this.name = this.customId;
        this.queryingMode = options.queryingMode || "exact";
    }
    /*z
     * @param {Interaction} interaction
     * @override
     * */
    run(interaction, ...additionalParams) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.customId + " interaction is not present.");
    }
}
exports.ComponentInteraction = ComponentInteraction;
