const { ComponentInteraction } = require("../../out/index");

module.exports = class extends ComponentInteraction {
	constructor(...args) {
		super(...args, {
			customId: "example_butt2on",
		});
	}

	async run(interaction) {
		interaction.reply("wow2ee");
	}
};
