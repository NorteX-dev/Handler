const dotenv = require("dotenv");
dotenv.config();

const { Client, Intents } = require("discord.js");
const { InteractionHandler } = require("../out");
const { intersection } = require("lodash");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const interactionHandler = new InteractionHandler({
	client: client,
	directory: "./test/commands",
});

interactionHandler.on("load", (command) => {
	console.log("Interaction " + command.name + " has been loaded.");
});
interactionHandler.on("ready", () => {
	console.log("All files loaded!");
});
interactionHandler.on("debug", (debug) => {
	console.log(`[Debug] ${debug}`);
});

client.on("ready", () => {
	interactionHandler.updateInteractions();
});

client.login(process.env.TOKEN).then(() => {
	console.log("Bot is listening", client.user.tag);
});
