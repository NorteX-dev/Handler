const { ComponentInteraction } = require("../../out/index");

module.exports = class extends ComponentInteraction {
	constructor(...args) {
		super(...args, {
			customId: "example_button",
		});
	}

	async run(interaction) {
		interaction.reply("wowee");
	}
};
