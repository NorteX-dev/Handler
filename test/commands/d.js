const { Command } = require("../../out");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "d",
		});
	}

	async run() {
		this.reply("d");
	}
};
