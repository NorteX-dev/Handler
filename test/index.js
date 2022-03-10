const dotenv = require("dotenv");
dotenv.config();

const { Client, Intents } = require("discord.js");
const { Util } = require("../out");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const { commandHandler } = Util.createMany(client, {
	commands: {
		directory: "./test/commands",
	},
});

commandHandler.on("load", (c) => {
	console.log(commandHandler.commands);
});

client.login(process.env.TOKEN).then(() => {
	console.log("Bot is listening", client.user.tag);
});
