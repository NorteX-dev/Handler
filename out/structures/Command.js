"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
class Command {
    autocomplete(interaction, additionalParams) {
        return;
    }
    run(interaction, additionalParams) {
        throw new MethodNotOverridenError_1.MethodNotOverridenError(`run() method on ${this.name} command is not present.`);
    }
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            disabled: this.disabled,
            category: this.category,
            guild_id: this.guildId,
            user_ids: this.userIds,
            guild_ids: this.guildIds,
            default_member_permissions: this.defaultMemberPermissions,
        };
    }
}
exports.Command = Command;
