"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventHandler_1 = require("../handlers/EventHandler");
const CommandHandler_1 = require("../handlers/CommandHandler");
const ComponentHandler_1 = require("../handlers/ComponentHandler");
class Util {
    constructor(client) {
        this.client = client;
    }
    static createMany(client, options) {
        if (!client || !options)
            throw new Error("createMany(): Invalid client or directories.");
        let handlers = {
            commandHandler: undefined,
            eventHandler: undefined,
            componentHandler: undefined,
        };
        for (let [key, value] of Object.entries(options)) {
            if (key === "events")
                handlers.eventHandler = new EventHandler_1.EventHandler({ client, ...value });
            else if (key === "commands")
                handlers.commandHandler = new CommandHandler_1.CommandHandler({ client, ...value });
            else if (key === "components")
                handlers.componentHandler = new ComponentHandler_1.ComponentHandler({ client, ...value });
            else
                throw new Error(`createMany(): Invalid key '${key}' inside 'options'. Valid keys are 'commands', 'events' and 'components'.`);
        }
        return handlers;
    }
    static createMessageLink(guildId, channelId, messageId) {
        if (!guildId || !channelId)
            throw new TypeError("createMessageLink(): missing required properties: 'guildId', 'channelId'.");
        if (messageId)
            return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
        return `https://discord.com/channels/${guildId}/${channelId}`;
    }
}
exports.default = Util;
