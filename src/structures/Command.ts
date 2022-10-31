import { CommandHandler } from "../handlers/CommandHandler";
import { MethodNotOverridenError } from "../errors/MethodNotOverridenError";

export class Command {
	public handler: CommandHandler | undefined;
	public client: any;
	public name: string | undefined;
	public description: string | undefined;
	public options: any[] | undefined;
	public defaultPermissions: any[] | undefined;
	public disabled: boolean | undefined;
	// Nullifiable fields
	public category: string | undefined;
	public guildId: string | undefined;
	public userIds: string[] | undefined;
	public guildIds: string[] | undefined;

	run(interaction: any, additionalParams?: any) {
		throw new MethodNotOverridenError(`run() method on ${this.name} command is not present.`);
	}
}
