const { Command } = require("../../out");

module.exports = class extends Command {
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
