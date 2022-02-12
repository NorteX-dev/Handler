## `@nortex/handler`
### The easy and clean way to effortlessly handle commands and events.

> **Quick note about naming standards:**
>
> "Commands" are classic message-based commands, such as `?ban <@user>`.
> Remember that this requires the message content intent.
> 
> "Interactions" are slash commands and context menus, such as `/ban user:Username`.
> 
> "Events" are the normal events of Discord.js such as `messageCreate`, `guildMemberAdd`.

#### Table of Contents:
- [Changelog [v3 to v4]](#changelog)
- [Changelog [v4 to v4.1]](#changelog-minor)
- [Installation](#installation)
- [Usage](#usage)

<a id="changelog"></a>
### Changelog v3.0 to v4.0
- Handling message commands is now up to the user; you should now create a messageCreate event, either on the client directly or using the EventHandler class, and then invoking `handler.runCommand(message)`.
- Created a new `handler.runCommand(message)` method that returns a Promise that should be executed on the `messageCreate` event. The handler will no longer create any events.
- Added and fixed `userRoles` and `botRoles` options.
- Fixed `userPermissions` and `botPermissions` options.
- Pass additional options as a spread argument to the `runCommand` method. These will be available at the end of the run() function on the command.

<a id="changelog-minor"></a>
### Changelog v4.0.x to 4.1.x
- Usage is now automatically concatonated with the prefix and command name
- Empty usage will now be undefined instead of an empty string ("")
- Any additional configuration keys (any other keys than CommandOptions) provided to command options will now be available in `this.opts.x`.
- If description is undefined it will be an empty string ("") instead of "Empty".
- Interaction handler now requires runInteraction() and won't set any events by itself anymore - same treatment as CommandHandler.
- Fixed verification of `disabled`, `guildIds` and `userIds` flags in interaction.
- Running commands and interactions is no longer awaited - promise of runCommand() and runInteraction() will get resolved instantly instead of awaiting the run() function.

### Changelog v4.1 to v4.2
- The `prefix` property inside CommandHandler constructor can now accept an Array with multiple prefixes.
- Same treatment as above to the setPrefix method.
- > Small notice: If a message satisfies two or more prefixes, the command is still going to execute once.
- Removed this.opts added in the previous minor update in favor of assigning properties to the class command itself, like `this.x = "Hello World!"`

<a id="todos"></a>
### TODOs
- Argument handler - automatic prompting if argument was not provided (with option to explicitely disable prompting).

<a id="disclaimer"></a>
> Warning: this guide does not explain the step of creating a basic discord bot throughly. If you don't know to create bots, refer to other sources first.
<a id="installation"></a>
### Installation

To install the package, run:
```shell
$ npm install @nortex/handler
```

Include it in your code using
```js
const Handler = require("@nortex/handler");
```

<a id="usage"></a>
### Usage
Run this code to create a command handler on the Discord.js `client` instance:
```js
const handler = new CommandHandler({
  client: client,
  directory: require("path").join(__dirname, "./Commands") // Change to your directory
});

// Handle events emitted by the command handler
handler.on("load", command => {
  // Emits when a command is loaded
  console.log("Loaded", command.name);
})
handler.on("error", e => {
  // Emits when an internal exception occurs in the code
  console.error(e);
});
handler.on("debug", e => {
  // Emits additional debug information
  console.log(`[Debug] ${e.message}`); // Logging debug is not required but very useful when creating the bot.
});
```

After creating the handler, you should handle the command execution on a `messageCreate`. You can do so using the EventHandler class or manually:
```js
client.on("messageCreate", message => {
  handler.runCommand(message).then(() => {
	// Command was executed
  }).catch(err => {
	// Command was not executed properly, for example from a lack of permissions.
	message.reply("Error: " + err.message);
  });
});
```
