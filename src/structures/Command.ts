import MethodNotOverridenError from "../errors/MethodNotOverridenError";
import { Interaction } from "discord.js";

export class Command {
	public name: string | undefined;
	public description: string | undefined;
	public options: any[] | undefined;
	public dmOnly: boolean | undefined;
	public guildOnly: boolean | undefined;

	async run(interaction: Interaction) {
		throw new MethodNotOverridenError("run() method must be overriden.");
	}
}
