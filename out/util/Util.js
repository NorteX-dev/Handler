"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const CommandHandler_1 = require("../handlers/CommandHandler");
const EventHandler_1 = require("../handlers/EventHandler");
const InteractionHandler_1 = require("../handlers/InteractionHandler");
const ComponentHandler_1 = require("../handlers/ComponentHandler");
class Util {
    constructor(client) {
        this.client = client;
    }
    /**
     * Util function for creating many handlers at once.
     *
     * @returns Object<string, AnyHandler>
     *
     * @param client The client instance to create handlers with.
     * @param {ManyClientsInterface} options An object with the key as the handler names, and the values as the options (excl. the client option) being passed into their constructors.
     *
     * @example
     * const handlers = Util.createMany(client, {
     *  commands: {
     *    directory: "./commands",
     *    prefix: "!"
     *  },
     *  interactions: {
     *    directory: "./interactions",
     *    autoLoad: false,
     *  }
     * }
     * */
    static createMany(client, options) {
        if (!client || !options)
            throw new Error("createMany(): Invalid client or directories.");
        let handlers = {
            commandHandler: null,
            eventHandler: null,
            interactionHandler: null,
            componentHandler: null,
        };
        const keys = Object.keys(options);
        for (let key of keys) {
            if (key === "commands")
                handlers.commandHandler = new CommandHandler_1.CommandHandler(Object.assign({ client }, options[key]));
            else if (key === "events")
                handlers.eventHandler = new EventHandler_1.EventHandler(Object.assign({ client }, options[key]));
            else if (key === "interactions")
                handlers.interactionHandler = new InteractionHandler_1.InteractionHandler(Object.assign({ client }, options[key]));
            else if (key === "components")
                handlers.componentHandler = new ComponentHandler_1.ComponentHandler(Object.assign({ client }, options[key]));
            else
                throw new Error(`createMany(): Invalid key '${key}' inside 'options'. Valid keys are 'commands', 'events', 'interactions', and 'components'.`);
        }
        return handlers;
    }
}
exports.Util = Util;
