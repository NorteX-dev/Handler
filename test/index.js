const dotenv = require("dotenv");
dotenv.config();

const { Client, Intents } = require("discord.js");
const { CommandHandler } = require("../out");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const cmdHandler = new CommandHandler({
	client: client,
	directory: "./test/commands",
});
cmdHandler.on("load", (command) => {
	console.log("Interaction " + command.name + " has been loaded.");
});
cmdHandler.on("ready", () => {
	console.log("All files loaded!");
});
cmdHandler.on("debug", (debug) => {
	console.log(`[Debug] ${debug}`);
});

client.on("messageCreate", (message) => {
	cmdHandler.runCommand(message).catch((err) => {
		console.log(err);
	});
});

client.login(process.env.TOKEN).then(() => {
	console.log("Bot is listening", client.user.tag);
});
