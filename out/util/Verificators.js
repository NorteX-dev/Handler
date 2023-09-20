"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutionError_1 = require("../errors/ExecutionError");
class Verificators {
    static verifyCommand(interaction, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => {
                var _a;
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
                if (cmd.userIds && ((_a = cmd.userIds) === null || _a === void 0 ? void 0 : _a.length) && !cmd.userIds.includes(interaction.user.id)) {
                    return res(new ExecutionError_1.ExecutionError("This user ID is not whitelisted.", "USER_ID_NOT_WHITELISTED"));
                }
                res(undefined);
            });
        });
    }
    static isClass(obj) {
        const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === "class";
        if (obj.prototype === undefined) {
            return isCtorClass;
        }
        const isPrototypeCtorClass = obj.prototype.constructor && obj.prototype.constructor.toString && obj.prototype.constructor.toString().substring(0, 5) === "class";
        return isCtorClass || isPrototypeCtorClass;
    }
}
exports.default = Verificators;
