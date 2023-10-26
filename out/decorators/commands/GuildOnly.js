"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildOnly = void 0;
const Command_1 = require("../../structures/Command");
const GuildOnly = (target) => {
    if (!(target.prototype instanceof Command_1.Command)) {
        throw new TypeError("The @GuildOnly decorator can only be used on Command classes.");
    }
    Object.defineProperty(target.prototype, "guildOnly", {
        value: true,
    });
};
exports.GuildOnly = GuildOnly;
