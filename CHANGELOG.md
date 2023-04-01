### 7.3.2
- Updated Discord.js to 14.8.0

### Version 7.0 changelog

#### Warning: v7 is a major update. Compatibility with v6 is not supported.

- Discord.js version is now v14. The handler is no longer compatible with v13.
- The handler is now fully TypeScript based because of the decorators used. Clean JavaScript is not supported anymore.
- Removed message-based command support to align with Discord's plan.
- ContextMenu suport has been temporarily removed.
- Added toJSON() method to the Command class (other classes are soon to follow).
- Code refactoring:
    - The majority (if not all) imports are now named instead of default.
