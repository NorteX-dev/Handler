import { CommandHandler, ComponentHandler, EventHandler, InteractionHandler } from "../../out";
export default function createHandlers(handlerClasses: Array<CommandHandler | ComponentHandler | EventHandler | InteractionHandler>, data: any): (CommandHandler | ComponentHandler | EventHandler | InteractionHandler)[];
