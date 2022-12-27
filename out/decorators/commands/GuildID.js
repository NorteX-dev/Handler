"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildID = void 0;
var Command_1 = require("../../structures/Command");
var GuildID = function (guildId) { return function (target) {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @GuildIDs decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "guildId", {
        value: guildId,
    });
}; };
exports.GuildID = GuildID;
