"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var ContextMenu = /** @class */ (function () {
    function ContextMenu(handler, filename, options) {
        if (!options)
            options = {};
        if (!options.name || !options.type)
            throw new Error("Failed to load ".concat(filename, ": name and type are required."));
        this.handler = handler;
        this.client = handler.client;
        this.type = options.type;
        this.name = options.name || filename;
        this.userIds = options.userIds || [];
        this.guildIds = options.guildIds || [];
        this.disabled = options.disabled || false;
        this.defaultPermissions = options.defaultPermissions;
    }
    /**
     * @param interaction The Discord.js interaction object
     * @param additionalParams Parameters that were passed in runInteraction()
     *
     * @override
     * */
    ContextMenu.prototype.run = function (interaction, additionalParams) {
        throw new MethodNotOverridenError_1.default("run() method on ".concat(this.name, " interaction is not present."));
    };
    return ContextMenu;
}());
exports.default = ContextMenu;
