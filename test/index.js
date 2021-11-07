require("dotenv").config();

const { EventHandler } = require("../out/index");
const { Client, Intents } = require("discord.js");
const path = require("path");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const handler = new EventHandler({
	client: client,
	directory: path.join(__dirname, "./events"),
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
handler.on("debug", (debugMsg) => {
	console.log("[Debug]", debugMsg);
});

client.login(process.env.TOKEN).then(() => {
	console.log("Bot is listening", client.user.tag);
});
