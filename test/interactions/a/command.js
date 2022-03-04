const { InteractionCommand } = require("../../../out");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = class extends InteractionCommand {
	constructor(...args) {
		super(...args, {
			name: "command",
			description: "A command interaction",
			options: [
				{
					name: "hi",
					type: "STRING",
					description: "A string optin.",
				},
			],
		});
	}

	async run(interaction) {
		interaction.reply({ content: "Hello, world!", components: [new MessageActionRow().addComponents(new MessageButton({ label: "clicc", customId: "example_button", style: "PRIMARY" }))] });
	}
};
