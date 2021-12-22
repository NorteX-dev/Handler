const dotenv = require("dotenv");
dotenv.config();
const { Client, Intents } = require("discord.js");
const { InteractionHandler } = require("../out/index.js");
const path = require("path");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const handler = new InteractionHandler({
	client: client,
	directory: path.join(__dirname, "./Interactions"),
	prefix: "?",
	autoLoad: true,
});

handler.on("load", (interaction) => {
	console.log("Command " + interaction.name + " has been loaded.");
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
client.login("ODYyNDExODMxMTMzOTk1MDI5.YOX9mw.8TG4-QivZYS4UZFmwYkqDXn7zow").then(() => {
	// client.login(process.env.TOKEN).then(() => {
	console.log("Bot is listening", client.user.tag);
});
