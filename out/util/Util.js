"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
var CommandHandler_1 = require("../handlers/CommandHandler");
var EventHandler_1 = require("../handlers/EventHandler");
var InteractionHandler_1 = require("../handlers/InteractionHandler");
var ComponentHandler_1 = require("../handlers/ComponentHandler");
var Util = /** @class */ (function () {
    function Util(client) {
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
    Util.createMany = function (client, options) {
        if (!client || !options)
            throw new Error("createMany(): Invalid client or directories.");
        var handlers = {
            commandHandler: undefined,
            eventHandler: undefined,
            interactionHandler: undefined,
            componentHandler: undefined,
        };
        var keys = Object.keys(options);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (key === "commands")
                handlers.commandHandler = new CommandHandler_1.CommandHandler(__assign({ client: client }, options[key]));
            else if (key === "events")
                handlers.eventHandler = new EventHandler_1.EventHandler(__assign({ client: client }, options[key]));
            else if (key === "interactions")
                handlers.interactionHandler = new InteractionHandler_1.InteractionHandler(__assign({ client: client }, options[key]));
            else if (key === "components")
                handlers.componentHandler = new ComponentHandler_1.ComponentHandler(__assign({ client: client }, options[key]));
            else
                throw new Error("createMany(): Invalid key '".concat(key, "' inside 'options'. Valid keys are 'commands', 'events', 'interactions', and 'components'."));
        }
        return handlers;
    };
    return Util;
}());
exports.Util = Util;
