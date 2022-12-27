"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var MethodNotOverridenError_1 = require("../errors/MethodNotOverridenError");
var Command = /** @class */ (function () {
    function Command() {
    }
    Command.prototype.run = function (interaction, additionalParams) {
        throw new MethodNotOverridenError_1.MethodNotOverridenError("run() method on ".concat(this.name, " command is not present."));
    };
    Command.prototype.toJSON = function () {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            default_permissions: this.defaultPermissions,
            disabled: this.disabled,
            category: this.category,
            guild_id: this.guildId,
            user_ids: this.userIds,
            guild_ids: this.guildIds,
        };
    };
    return Command;
}());
exports.Command = Command;
