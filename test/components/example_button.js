const { ComponentInteraction } = require("../../out/index");

module.exports = class extends ComponentInteraction {
	constructor(...args) {
		super(...args, {
			customId: "example_butt",
			queryingMode: "exact",
		});
	}

	async run(interaction) {
		interaction.reply("wowee");
	}
};
