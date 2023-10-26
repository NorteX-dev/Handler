"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutionError_1 = require("../errors/ExecutionError");
class Verificators {
    static async verifyCommand(interaction, cmd) {
        return new Promise((res) => {
            // "disabled" field
            if (cmd.disabled) {
                return res(new ExecutionError_1.ExecutionError("The command is disabled.", "DISABLED"));
            }
            // "guildIds" field
            const guildIdInvalid = interaction.guild && cmd.guildIds && cmd.guildIds.length && !cmd.guildIds.includes(interaction.guild.id);
            if (guildIdInvalid) {
                return res(new ExecutionError_1.ExecutionError("This guild ID is not whitelisted.", "GUILD_ID_NOT_WHITELISTED"));
            }
            // "userIds" field
            if (cmd.userIds && cmd.userIds?.length && !cmd.userIds.includes(interaction.user.id)) {
                return res(new ExecutionError_1.ExecutionError("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
            }
            res(undefined);
        });
    }
    static isClass(v) {
        return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
    }
}
exports.default = Verificators;
