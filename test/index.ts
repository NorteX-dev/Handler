import { ChatInputCommandInteraction, Client, GatewayIntentBits, InteractionType } from "discord.js";
import { CommandHandler } from "../src";
import * as path from "path";
import { token } from "./config";

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const handler = new CommandHandler({
	client: client as any,
	directory: path.join(__dirname, "./commands"),
});

client.on("ready", () => {
	console.log("I am ready!");
	handler.updateInteractions().then(console.log);
});

client.on("interactionCreate", (int) => {
	if (int.type === InteractionType.ApplicationCommand && int instanceof ChatInputCommandInteraction) {
		handler.runCommand(int);
	}
});

handler.on("debug", console.log);

client.login(token);
