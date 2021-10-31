const { Event } = require("../../out/index");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			name: "channelUpdate",
			once: false,
		});
	}

	async run() {}
};
