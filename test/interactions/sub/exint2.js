const { Interaction } = require("../../../out/index");

module.exports = class extends Interaction {
	constructor(...args) {
		super(...args, {
			name: "exint2",
			type: "command",
			description: "This is the command description.",
			userIds: [],
			guildsId: [],
			defaultPermission: true,
			disabled: false,
			options: [{ name: "user", type: "USER", description: "User to target." }],
		});
	}

	async run(interaction) {
		console.log(this);
		interaction.reply({ content: "OK!" });
	}
};
