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
- [Installation](#installation)
- [Usage](#usage)

<a id="changelog"></a>
### Changelog v3 to v4

- Handling message commands is now up to the user; you should now create a messageCreate event, either on the client directly or using the EventHandler class, and then invoking `handler.runCommand(message)`.
- Created a new `handler.runCommand(message)` method that returns a Promise that should be executed on the `messageCreate` event. The handler will no longer create any events.
- Added and fixed `userRoles` and `botRoles` options
- Fixed `userPermissions` and `botPermissions` options
- [todo] Tip: Pass additional options as a spread argument to the `runCommand` method. These will be available at the end of the run() function on the command.
- [todo] Added a new option to the command handler: `userCooldownOverwriteRoleId` as well as `guildCooldownOverwriteRoleId` and their permission counterparts: `userCooldownOverwritePermission` and `guildCooldownOVerwritePermission`. If the user satisfies any of these requirements, cooldown will not affect them.

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
