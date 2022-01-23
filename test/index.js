const dotenv = require("dotenv");
dotenv.config();

const { Client, Intents } = require("discord.js");
const { CommandHandler } = require("../out/index.js");
const path = require("path");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const handler = new CommandHandler({
	client: client,
	directory: path.join(__dirname, "Commands"),
	prefix: "?",
});

handler.on("load", (command) => {
	console.log("Command " + command.name + " has been loaded.");
});
handler.on("ready", () => {
	console.log("All files loaded!");
});
handler.on("error", (err, message) => {
	message.channel.send({ content: err.message });
});
handler.on("debug", (debug) => {
	console.log(`[Debug] ${debug}`);
});
client.on("messageCreate", (message) => {
	handler
		.runCommand(message, { fakeObject: "for some fetch operation" })
		.then((r) => {
			console.log(r);
		})
		.catch((err) => {
			console.log(err);
		});
});

client.login("ODYyNDExODMxMTMzOTk1MDI5.YOX9mw.vMIny0qiMm4yrY753SgafWf5FQc").then(() => {
	console.log("Bot is listening", client.user.tag);
});
