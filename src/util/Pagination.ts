import { EventEmitter } from "events";
import {
	InteractionCollector,
	Message,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	MessageEmbed,
	TextBasedChannel,
} from "discord.js";
import { nanoid } from "nanoid";

export default class Pagination extends EventEmitter {
	private collector?: InteractionCollector<any>;
	public page: number;
	public dataset?: Array<any>;
	public currentPageDataset?: Array<any>;
	public perPage?: number;
	public channel?: TextBasedChannel;
	public maxPage: number;
	public ended: boolean;
	public isCreated: boolean;
	private messageRef?: Message;
	private readonly randomId: string;
	private readonly ids: Array<string>;

	constructor() {
		super();
		this.page = 1;
		this.ended = false;
		this.maxPage = 0;
		this.isCreated = false;
		this.randomId = nanoid();
		this.ids = ["PREVIOUS", "NEXT", "GOTO", "STOP"];
		this.ids = this.ids.map((i) => "PAGINATION_" + i + `_${this.randomId}`);
	}

	private constructEmbed() {
		if (!this.dataset || !this.dataset.length) throw new Error("cnstructEmbed(): Can't construct embed with data as the dataset is empty.");
		const perPage = this.perPage || 10;
		let dataset = this.dataset;
		dataset = dataset.map((el: string, i: number) => `**${i + 1}**. ${el}`);
		const dataFromPage = dataset.slice((this.page - 1) * perPage, this.page * perPage);
		this.currentPageDataset = dataset.slice((this.page - 1) * perPage, this.page * perPage);
		const embed = new MessageEmbed();
		embed.setDescription(dataFromPage.join("\n")).setFooter({ text: `Page ${this.page}/${this.maxPage}` });
		return embed;
	}

	private async updateContent() {
		const row = new MessageActionRow().addComponents(
			new MessageButton({ label: "<", style: "PRIMARY", customId: this.ids[0] }),
			new MessageButton({ label: ">", style: "PRIMARY", customId: this.ids[1] }),
			new MessageButton({ label: "Go to Page", style: "SECONDARY", customId: this.ids[2] }),
			new MessageButton({ label: "Stop", style: "DANGER", customId: this.ids[3] })
		);
		if (!this.messageRef) {
			this.messageRef = await this.channel!.send({ embeds: [this.constructEmbed()], components: [row] });
		} else {
			if (this.ended) {
				const msg = await this.channel!.messages.fetch(this.messageRef.id).catch(() => {});
				if (!msg) return;
				await msg.edit({ embeds: [this.constructEmbed()], components: [] });
				return;
			}
			const msg = await this.channel!.messages.fetch(this.messageRef.id).catch(() => {});
			if (!msg) return this.stop("Pagination message got deleted or is inaccessible.");
			await msg.edit({ embeds: [this.constructEmbed()], components: [row] });
		}
	}

	/* ------------------ BEING PUBLIC METHODS ------------------ */

	async create(dataset: Array<any>, channel: TextBasedChannel, initiatorId: string, perPage: number = 10, time: number = 60000) {
		if (Array.isArray(dataset)) this.dataset = dataset;
		else this.dataset = [dataset];
		if (!this.dataset || !this.dataset.length) throw new Error("create(): Can't create pagination as the specified dataset is empty.");
		this.perPage = perPage;
		this.channel = channel;
		this.maxPage = Math.ceil(this.dataset.length / this.perPage);
		const filter = (interaction: MessageComponentInteraction) => {
			return interaction.user.id === initiatorId && this.ids.includes(interaction.customId);
		};
		await this.updateContent();
		this.isCreated = true;
		this.collector = channel.createMessageComponentCollector({ filter, idle: time });
		this.collector.on("collect", async (interaction: MessageComponentInteraction) => {
			// Handle page switching and emit events
			if (interaction.customId === this.ids[0]) {
				// Previous page
				if (this.page > 1) {
					interaction.deferUpdate();
					this.page--;
					await this.updateContent();
					this.emit("change", {
						next: true,
						previous: false,
						page: this.page,
						maxPage: this.maxPage,
						perPage: this.perPage,
						results: this.currentPageDataset,
					});
				}
			}
			if (interaction.customId === this.ids[1]) {
				// Next page
				if (this.page < this.maxPage) {
					interaction.deferUpdate();
					this.page++;
					await this.updateContent();
					this.emit("change", {
						next: false,
						previous: true,
						page: this.page,
						maxPage: this.maxPage,
						perPage: this.perPage,
						results: this.currentPageDataset,
					});
				}
			}
			if (interaction.customId === this.ids[2]) {
				const gotoPageCollector = this.channel!.createMessageCollector({
					filter: (m) => m.author.id === initiatorId && !isNaN(parseInt(m.content)),
					max: 1,
					time: 30000,
				});
				await interaction.reply({
					embeds: [new MessageEmbed().setDescription("Please type in the page you want to go to.")],
					ephemeral: true,
				});
				gotoPageCollector.on("collect", async (gt) => {
					const page = parseInt(gt.content);
					gt.delete().catch(() => {});
					if (page > this.maxPage) {
						interaction.editReply({
							embeds: [
								new MessageEmbed().setColor("RED").setDescription(`This page doesn't exist. Pages go only up to ${this.maxPage}.`),
							],
						});
						return;
					}
					if (page <= 0) {
						interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`Page cannot be 0 or less.`)] });
						return;
					}
					this.page = page;
					await this.updateContent();
					await interaction.editReply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription("Page updated.")] });
				});
			}
			if (interaction.customId === this.ids[3]) {
				await interaction.deferUpdate();
				this.collector!.stop("User requested stop.");
			}
		});
		this.collector!.on("end", (collected, reason) => {
			this.stop(reason !== "idle" ? reason : "Pagination timed out.");
		});
		return this;
	}

	/**
	 * Stops the pagination with an optional reason.
	 *
	 * @param reason The reason of the stop.
	 *
	 * @returns Promise<Pagination>
	 * */
	async stop(reason?: string) {
		if (!this.isCreated) throw new Error("stop(): Pagination isn't created yet. If you aren't already, await the create function.");
		if (!this.collector || this.ended) throw new Error("stop(): Can't stop as the paginator already ended or the collector has been stopped.");
		if (!this.collector!.ended) this.collector.stop(reason);
		this.ended = true;
		await this.updateContent();
		this.emit("end", reason);
		return this;
	}

	/**
	 * Goes to a page instantly.
	 *
	 * @param page The page to go to. Must be within the maximum dataset length.
	 *
	 * @returns Promise<Pagination>
	 * */
	async setPage(page: number) {
		if (!this.isCreated) throw new Error("setPage(): Pagination isn't created yet. If you aren't already, await the create function.");
		if (!this.maxPage) throw new TypeError("setPage(): Pagination.maxPage is not defined.");
		if (this.maxPage < page) throw new TypeError("setPage(): Pagination.maxPage is greater than specified page.");
		if (page <= 0) throw new TypeError("setPage(): page parameter is less or equal to 0.");
		this.page = page;
		await this.updateContent();
		return this;
	}
}
