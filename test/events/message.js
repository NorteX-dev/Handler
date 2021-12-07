import { Event } from "../../out/index.js";

export default class extends Event {
	constructor(...args) {
		super(...args, {
			name: "channelUpdate",
			once: false,
		});
	}

	async run() {
		console.log("channelUpdate");
	}
}
