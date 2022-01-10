import { Client, Intents } from "discord.js";
// const { Client, Intents } = require("discord.js");
import dotenv from "dotenv";
// const dotenv = require("dotenv");
import { InteractionHandler } from "../out/index.js";
// const { InteractionHandler } = require("../out/index.js");
import path from "path";
// const path = require("path");

dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const handler = new InteractionHandler({
	client: client,
	directory: path.join(process.cwd(), "./test/Interactions"),
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
client.login("ODYyNDExODMxMTMzOTk1MDI5.YOX9mw._A8irtWcOGvNJcWjaYqGRySmDxU").then(() => {
	// client.login(process.env.TOKEN).then(() => {
	console.log("Bot is listening", client.user.tag);
});
