const { Command } = require("../../../out");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "command",
			description: "A command interaction",
			usage: "<command>",
		});
	}

	async run(message) {
		message.reply(`Usage: ${this.usage}`);
	}
};
