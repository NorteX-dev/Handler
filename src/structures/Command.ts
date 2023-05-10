import { CommandHandler } from "../handlers/CommandHandler";
import { MethodNotOverridenError } from "../errors/MethodNotOverridenError";

export class Command {
	public handler: CommandHandler | undefined;
	public client: any;
	public name: string | undefined;
	public description: string | undefined;
	public options: any[] | undefined;
	public disabled: boolean | undefined;
	public defaultMemberPermissions: number | undefined;
	// Nullable fields
	public category: string | undefined;
	public guildId: string | undefined;
	public userIds: string[] | undefined;
	public guildIds: string[] | undefined;

	autocomplete(interaction: any, additionalParams?: any) {
		return;
	}

	run(interaction: any, additionalParams?: any) {
		throw new MethodNotOverridenError(`run() method on ${this.name} command is not present.`);
	}

	toJSON() {
		return {
			name: this.name,
			description: this.description,
			options: this.options,
			disabled: this.disabled,
			category: this.category,
			guild_id: this.guildId,
			user_ids: this.userIds,
			guild_ids: this.guildIds,
			default_member_permissions: this.defaultMemberPermissions,
		};
	}
}
