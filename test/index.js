import dotenv from "dotenv";
dotenv.config();

import { Client, Intents } from "discord.js";
import { InteractionHandler } from "../out/index.js";
import * as path from "path";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const handler = new InteractionHandler({
	client: client,
	directory: path.join(process.cwd(), "./src/interactions"),
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
// client.login(process.env.TOKEN).then(() => {
client.login("ODYyNDExODMxMTMzOTk1MDI5.YOX9mw.rKrpCo-m9WoU78zZ2embnDEqe_A").then(() => {
	console.log("Bot is listening", client.user.tag);
});
