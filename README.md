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
> 
> "Components" are interactions of message component type, like buttons and select menus.

#### Table of Contents:
- [Changelog [v4.2 to v5]](#changelog)
- [Installation](#installation)
- [Usage](#usage)

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
const { CommandHandler } = require("@nortex/handler");
```

<a id="usage"></a>
### Usage
Run this code to create a command handler on the Discord.js `client` instance:
```js
const handler = new CommandHandler({
  client: client,
  directory: "./Commands" // Change to your directory (relative to root dir)
});

// Handle events emitted by the command handler
handler.on("load", command => {
  // Emits when a command is loaded
  console.log("Loaded", command.name);
})
// Listening to debug is not required but might come in useful when developing.
handler.on("debug", e => {
  // Emits additional debug information
  console.log(`[Debug] ${e.message}`);
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

<a id="changelog"></a>
### Changelog v4.2 to v5
Breaking changes:
- **Paths supplied to each handlers' constructors should now be relative instead of absolute, like "./path/to/directory". Make sure you input paths relative to the project ROOT (`process.cwd()`) and not the file you're executing the code in.**
- Arguments passed into the `super` constructor of each handler should now be (handler, name) instead of (handler, client, name). You can get the client instance from `handler.client`.
- `setCommandDirectory(absolutePath)` has been changed to `setDirectory(relativePath)`.
- `setInteractionDirectory(absolutePath)` has been changed to `setDirectory(relativePath)`.
- `setEventsDirectory(absolutePath)` has been changed to `setDirectory(relativePath)`.
- Removed `disableInbteractionModification` and `forceInteractionUpdate`. You now have to execute `interactionHandler.updateInteractions()` manually, in a `ready` event.
> Information: `interactionHandler.updateInteractions()` will by default check if anything has changed and if not, stop the refreshing.
Run `interactionHandler.updateInteractions(true)` to forcibly update all interactions.
Remember however that you might be ratelimited by the Discord API after doing refreshing interactions too many times.
- Listening to the error event with `.on("error")` is now removed in favor of catching exceptions returned from the runCommand() or runInteraction() (or similar) promise

Added:
- **ComponentHandler() - a handler specifically for handling message components (interactions with customId's), like buttons, select menus and modal responses.**
- For components, you can optionally specify an option: `queryingMode` which is a string and must be either of: `exact, includes, startsWith`. Defaults to `exact`.
- CommandHandler: Added `parameters[]` which is type `Parameter[]` and allows for handling of parameters with automatic prompting. Refer to the documentation of the `Parameter` interface for more information.
- Added createMany() static method on the Util class useful for creating multiple handlers at once
- registerCommand(commandInstance) is now public and documented. It allows for manual registration of commands and takes the instanced command as the parameter.
  If `includes` mode is set, any interactions that **include** the customId specified, will be matched & executed. Similar for `startsWith`, however for interactions which customIds **start with** the custom id specified in options.
  This is particularly useful for passing in custom IDs or values in the end of the custom ID since there is no way of passing custom data through component interactions.
- Added a static util method to Util class - createMessageLink - which creates a `https://discord.com/channels` link to a message or channel in Discord.
- 

Other changes:
- Changed Map's to custom Store classe whichs are a classes extending Array, which provides all array methods + some specific methods
- CommandDirectoryReferenceError, EventsDirectoryReferenceError and InteractionDirectoryReferenceError have been merged into DirectoryReferenceError.
- CommandExecutionError and InteractionExecutionError have been merged into ExecutionError.
- The COMMAND_NOT_FOUND error will now provide a `query` key inside the params instead of `typedCommand`.
- the `Verificators()` constructor should now be empty.
- Documented `runCommand()`, `runInteraction()` methods.
- Fixed clarification on loadEvents() docs description.
- Multiple miscellaneous code refactors
- Fixed typo in event name causing the event to not fire properly
