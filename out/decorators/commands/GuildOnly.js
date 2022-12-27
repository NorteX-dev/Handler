"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildOnly = void 0;
var Command_1 = require("../../structures/Command");
var GuildOnly = function (target) {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @GuildOnly decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "guildOnly", {
        value: true,
    });
};
exports.GuildOnly = GuildOnly;
