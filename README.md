# @nortex/handler - effortlessly handle commands and events.

## Prerequisites
- Discord.js v14.x
- TypeScript 4.7+
- NodeJS v18

**Warning:** Versions v7 of this package DO NOT WORK with JavaScript and are TypeScript only. This is due to the severe dependency on decorators which are not implemented in pure ECMAScript (yet).

## Installation
```bash
npm i @nortex/handler
```

## Basic usage - handling commands
```ts
// ./client.ts
import { Client, GatewayIntentBits, Interaction, InteractionType } from "discord.js";
import { CommandHandler, Command, ExecutionError } from "@nortex/handler";
import * as path from "path";

const client: Client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commandHandler: CommandHandler = new CommandHandler({
  client: client, // The Discord.js client instance
  directory: path.join("./commands/") // The directory where the commands should be imported from
});

/*
* It is important that no files are stored inside the directory specified above except for command files.
* Comamnd files must export a default class which extend Command.
* Any files that are stored within this directory (in shown example "./commands/" and do not export a command class will throw an exception.
* */

// You can optionally listen to handler events for example 'load':
commandHandler.on("load", (command: Command) => {
	// `command` is the command class which contains name, description, etc.
  console.log("Loaded", command.name);
});

client.on("ready", () => {
	console.log("Ready!");
});

// You have to manually run the interaction, otherwise it is not going to run and the user will see a "The app hasn't responded" message.
client.on("interactionCreate", (interaction: Interaction) => {
	// Do not run interactions that are not application commands.
  // If you attempt to run a non-application-command interaction with CommandHandler, an error will be thrown.
	if(interaction.type !== InteractionType.APPLICATION_COMMAND) return;
	
	commandHandler.runInteraction(interaction).catch((err: ExecutionError) => {
		// Some error happened during the execution of the command itself.
    // This could be caused by:
    // - the command being disabled
    // - the user trying to execute the command not being in the userIds array (if present)
    // - the user trying to execute the command not being in the guildIds array (if present)
    interaction.reply({
      content: err.message,
    });
  });
});

client.login(process.env.TOKEN);
```

```ts
// ./commands/example_command.ts
import { CommandInteraction } from "discord.js";
import { Command, Name, Description } from "@nortex/handler";

// The bare minimum for commands are the Name and Description decorators.
@Name("hello")
@Description("Say hello.")
export default class ExampleCommand extends Command {
	// The class must have its own run() command, otherwise a MethodNotOverridenError will be thrown.
	async run(interaction: CommandInteraction) {
		// do something with the interaction
		interaction.reply({
			content: "Hello!",
		});
	}
}
```

You can duplicate the example_command.ts file to create new commands.
