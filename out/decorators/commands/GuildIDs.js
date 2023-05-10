"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildIDs = void 0;
const Command_1 = require("../../structures/Command");
const GuildIDs = (guildIds) => (target) => {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @GuildIDs decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "guildIds", {
        value: guildIds,
    });
};
exports.GuildIDs = GuildIDs;
