"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandInteraction = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var CommandInteraction = /** @class */ (function () {
    function CommandInteraction(handler, client, name, options) {
        var _this = this;
        if (!options)
            options = {};
        this.handler = handler;
        this.client = client;
        this.type = "CHAT_INPUT";
        this.name = options.name || name;
        this.description = options.description;
        this.options = options.options;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        this.defaultPermission = options.defaultPermission || true;
        this.opts = {}; // Initialize
        Object.keys(options).forEach(function (key) {
            if (["name", "description", "options", "userIds", "guildIds", "disabled", "defaultPermission"].includes(key)) {
                return;
            }
            // @ts-ignore
            _this.opts[key] = options[key];
        });
        if (!this.description)
            throw new Error("CommandInteraction: description is required.");
    }
    /*z
     * @param {Interaction} interaction
     * @override
     * */
    CommandInteraction.prototype.run = function (interaction) {
        throw new MethodNotOverridenError_1.default("run() method on " + this.name + " interaction is not present.");
    };
    return CommandInteraction;
}());
exports.CommandInteraction = CommandInteraction;
