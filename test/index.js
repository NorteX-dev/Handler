const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");
const { CommandHandler } = require("../out/index.js");
const path = require("path");

dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const handler = new CommandHandler({
	client: client,
	directory: path.join(__dirname, "Commands"),
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
client.login("ODYyNDExODMxMTMzOTk1MDI5.YOX9mw.za_cZVrJM3WLVqDaVaHyDmkOD1Y").then(() => {
	console.log("Bot is listening", client.user.tag);
});
