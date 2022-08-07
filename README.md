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
- [Changelog [v5 to v6]](#changelog)
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
const { MessageCommandHandler } = require("@nortex/handler");
```

<a id="usage"></a>
### Usage
Run this code to create a command handler on the Discord.js `client` instance:

```js
const handler = new MessageCommandHandler({
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
    // MessageCommand was executed
  }).catch(err => {
    // MessageCommand was not executed properly, for example from a lack of permissions.
    message.reply("Error: " + err.message);
  });
});
```

<a id="changelog"></a>
### Changelog v5 to v6
- The handler now runs on Discord.JS v14 and is not compatible with v13. Use v5 if you need v13 compatibility.
- **This version makes a drastic switch in the naming conventions:**
  - "Interactions" now become "Commands".
  - "Commands" now become "MessageCommands".
  - "Events" and "Components" remain the same.
Discord is discouraging the use of normal message-based commands and is pushing a lot more features to the interaction ecosystem. This change hopes to comply with those changes.
- With the above changes, developing the parameter system becomes redundant and so it has been removed as well.
- Replaced "Number" types with the better-suited non-capitalised "number" type.
- Combined "UserContextMenu" and "MessageContextMenu" into "ContextMenu" with a `type` property.
- "Handler" class has been renamed to "BaseHandler".
- [ ] Added Modal submit event to Component types.
- [ ] Temporarily removed support for context menus as they're undocumented in the Discord.js v14 documentation.
- Removed debug call for found components.
- Removed "Pagination" util because it falls outside of the scope of this handler.
