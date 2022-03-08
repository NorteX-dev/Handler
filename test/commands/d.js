const { InteractionCommand } = require("../../out");

module.exports = class extends InteractionCommand {
	constructor(...args) {
		super(...args, {
			name: "d",
			description: "A command that does nothing.",
		});
	}

	async run() {
		this.reply("d");
	}
};
