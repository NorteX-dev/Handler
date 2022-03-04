const dotenv = require("dotenv");
dotenv.config();

const { Client, Intents } = require("discord.js");
const { InteractionHandler, ComponentHandler } = require("../out");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const interactionHandler = new InteractionHandler({
	client: client,
	directory: "./test/interactions",
});

const componentHandler = new ComponentHandler({
	client: client,
	directory: "./test/components",
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

componentHandler.on("load", (command) => {
	console.log("Component " + command.name + " has been loaded.");
});
componentHandler.on("ready", () => {
	console.log("All files loaded!");
});
componentHandler.on("debug", (debug) => {
	console.log(`[Debug2] ${debug}`);
});

client.on("ready", () => {
	interactionHandler.updateInteractions(/*true*/);
});

client.on("interactionCreate", (int) => {
	if (int.isCommand() || int.isContextMenu()) {
		interactionHandler.runInteraction(int).catch((err) => {
			console.log(err);
		});
	} else {
		componentHandler.runComponent(int).catch((err) => {
			console.log(err);
		});
	}
});

client.login("ODYyNDExODMxMTMzOTk1MDI5.YOX9mw.OdAIcfi6OTuvWUw8Wezmnla6x4s").then(() => {
	console.log("Bot is listening", client.user.tag);
});
