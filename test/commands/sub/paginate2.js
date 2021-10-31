const { Command } = require("../../../out/index");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "ab",
			description: "This is the command description.",
			category: "Moderation",
			aliases: ["guildban"],
			usage: "",

			userPermissions: ["MANAGE_GUILD"],
			userRoles: ["822844266405298216"],
			botPermissions: ["MANAGE_GUILD"],
			botRoles: ["822844266405298216"],
			userCooldown: 0,
			guildCooldowns: 0,
			nsfw: false,
			allowDm: false,
			onlyDm: false,
			userIds: [],
			guildsId: [],
			disabled: false,
		});
	}

	async run(message, handler, args) {}
};
