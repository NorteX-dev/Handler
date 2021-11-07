## `@nortex/handler` - the easy and clean way to effortlessly handle various types of commands.
### The basic premise of this package is to make a handler that allows for clean code, customizability and ease of use.

---

> Quick note about naming standards:
>
> Commands are classic message-based commands, such as `?ban <@user>`.
> Remember that this requires the message content intent.
> 
> Interactions are slash commands and context menus combined - the relatively fresh way of creating commands available in the Discord API.
> 
> Events are the normal events of Discord.js such as messageCreate, guildMemberAdd...

#### Table of Contents:
- [Creating the bot](#bot_base)
- [Creating a basic Command Handler](#command_handler)
- [Making the command files](#commands_setup)
- [Using the options of commands](#command_options)
- [Creating a basic Event Handler](#event_handler)
- [Creating a basic Interaction Handler](#interaction_handler)
- [Understanding interaction refreshing](#interaction_refresher)
- [Using the options of interactions](#interaction_options)

<a id="bot_base"></a>
### 1. Creating a Discord.js bot
> Warning: this guide does not explain the step of creating a basic discord bot throughly. If you don't know to create bots, refer to other sources first.

To start using the handler you of course need to have a bot running first. A good first step toward making one is preparing the dependencies we are going to need.
This also includes the IDE or text editor; and you are welcome to use any one you prefer,
but some good ones are [Visual Studio Code](https://code.visualstudio.com/) or [Webstorm](https://www.jetbrains.com/webstorm/).

Then, retrieve a bot token from the [Discord Developer Portal](https://discord.com/developers/applications).
As an optional step, you might also want to set up a database (if you're going to need one).

Now that we have everything ready, we can install `discord.js` using `npm i discord.js` and start by writing this boilerplate code:

`MyClient.js`
```js
const { Client } = require("discord.js");
const { CommandHandler } = require("@nortex/handler");

// Create a class named anything (in this case MyClient) that extends the Client class of Discord.js.
module.exports = class MyClient extends Client {
	constructor() {
		// Supply some options to the Client constructor
		super({ intents: [Intents.FLAGS.GUILDS /*Pass extra intents if needed*/] })
    }

	async run() {
		super.login("YOUR_TOKEN");
    }
}
```

The following code should create a very basic bot instance and login using the token. If the bot shows up as online, proceed to the next step.

<a id="command_handler"></a>
### 2. Creating a basic command handler
Now that we have the bot running and dependencies satisfied, we can adding the handling of commands.

Inside the run() function of MyClient, we are going to initalize CommandHandler using:
```js
const handler = new CommandHandler({
	client: this,
	directory: require("path").join(__dirname, "./Commands") // Change to your directory
	/* Pass optional options here */
});
// Handle events emitted by the command handler
handler.on("load", command => {
	console.log("Loaded", command.name);
})
handler.on("error", e => {
	console.error(e);
});
```
Now, we can access the "handler"

> More of the README file is going to be finished soon.
