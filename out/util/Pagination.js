"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const events_1 = require("events");
const discord_js_1 = require("discord.js");
const nanoid_1 = require("nanoid");
class Pagination extends events_1.EventEmitter {
    constructor() {
        super();
        this.page = 1;
        this.ended = false;
        this.maxPage = 0;
        this.isCreated = false;
        this.randomId = (0, nanoid_1.nanoid)();
        this.ids = ["PREVIOUS", "NEXT", "GOTO", "STOP"];
        this.ids = this.ids.map((i) => "PAGINATION_" + i + `_${this.randomId}`);
    }
    constructEmbed() {
        if (!this.dataset || !this.dataset.length)
            throw new Error("cnstructEmbed(): Can't construct embed with data as the dataset is empty.");
        const perPage = this.perPage || 10;
        let dataset = this.dataset;
        dataset = dataset.map((el, i) => `**${i + 1}**. ${el}`);
        const dataFromPage = dataset.slice((this.page - 1) * perPage, this.page * perPage);
        this.currentPageDataset = dataset.slice((this.page - 1) * perPage, this.page * perPage);
        const embed = new discord_js_1.MessageEmbed();
        embed.setDescription(dataFromPage.join("\n")).setFooter({ text: `Page ${this.page}/${this.maxPage}` });
        return embed;
    }
    updateContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton({ label: "<", style: "PRIMARY", customId: this.ids[0] }), new discord_js_1.MessageButton({ label: ">", style: "PRIMARY", customId: this.ids[1] }), new discord_js_1.MessageButton({ label: "Go to Page", style: "SECONDARY", customId: this.ids[2] }), new discord_js_1.MessageButton({ label: "Stop", style: "DANGER", customId: this.ids[3] }));
            if (!this.messageRef) {
                this.messageRef = yield this.channel.send({ embeds: [this.constructEmbed()], components: [row] });
            }
            else {
                if (this.ended) {
                    const msg = yield this.channel.messages.fetch(this.messageRef.id).catch(() => { });
                    if (!msg)
                        return;
                    yield msg.edit({ embeds: [this.constructEmbed()], components: [] });
                    return;
                }
                const msg = yield this.channel.messages.fetch(this.messageRef.id).catch(() => { });
                if (!msg)
                    return this.stop("Pagination message got deleted or is inaccessible.");
                yield msg.edit({ embeds: [this.constructEmbed()], components: [row] });
            }
        });
    }
    /* ------------------ BEING PUBLIC METHODS ------------------ */
    create(dataset, channel, initiatorId, perPage = 10, time = 60000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(dataset))
                this.dataset = dataset;
            else
                this.dataset = [dataset];
            if (!this.dataset || !this.dataset.length)
                throw new Error("create(): Can't create pagination as the specified dataset is empty.");
            this.perPage = perPage;
            this.channel = channel;
            this.maxPage = Math.ceil(this.dataset.length / this.perPage);
            const filter = (interaction) => {
                return interaction.user.id === initiatorId && this.ids.includes(interaction.customId);
            };
            yield this.updateContent();
            this.isCreated = true;
            this.collector = channel.createMessageComponentCollector({ filter, idle: time });
            this.collector.on("collect", (interaction) => __awaiter(this, void 0, void 0, function* () {
                // Handle page switching and emit events
                if (interaction.customId === this.ids[0]) {
                    // Previous page
                    if (this.page > 1) {
                        interaction.deferUpdate();
                        this.page--;
                        yield this.updateContent();
                        this.emit("change", { next: true, previous: false, page: this.page, maxPage: this.maxPage, perPage: this.perPage, results: this.currentPageDataset });
                    }
                }
                if (interaction.customId === this.ids[1]) {
                    // Next page
                    if (this.page < this.maxPage) {
                        interaction.deferUpdate();
                        this.page++;
                        yield this.updateContent();
                        this.emit("change", { next: false, previous: true, page: this.page, maxPage: this.maxPage, perPage: this.perPage, results: this.currentPageDataset });
                    }
                }
                if (interaction.customId === this.ids[2]) {
                    const gotoPageCollector = this.channel.createMessageCollector({ filter: (m) => m.author.id === initiatorId && !isNaN(parseInt(m.content)), max: 1, time: 30000 });
                    yield interaction.reply({ embeds: [new discord_js_1.MessageEmbed().setDescription("Please type in the page you want to go to.")], ephemeral: true });
                    gotoPageCollector.on("collect", (gt) => __awaiter(this, void 0, void 0, function* () {
                        const page = parseInt(gt.content);
                        gt.delete().catch(() => { });
                        if (page > this.maxPage) {
                            interaction.editReply({ embeds: [new discord_js_1.MessageEmbed().setColor("RED").setDescription(`This page doesn't exist. Pages go only up to ${this.maxPage}.`)] });
                            return;
                        }
                        if (page <= 0) {
                            interaction.editReply({ embeds: [new discord_js_1.MessageEmbed().setColor("RED").setDescription(`Page cannot be 0 or less.`)] });
                            return;
                        }
                        this.page = page;
                        yield this.updateContent();
                        yield interaction.editReply({ embeds: [new discord_js_1.MessageEmbed().setColor("GREEN").setDescription("Page updated.")] });
                    }));
                }
                if (interaction.customId === this.ids[3]) {
                    yield interaction.deferUpdate();
                    this.collector.stop("User requested stop.");
                }
            }));
            this.collector.on("end", (collected, reason) => {
                this.stop(reason !== "idle" ? reason : "Pagination timed out.");
            });
            return this;
        });
    }
    /**
     * Stops the pagination with an optional reason.
     *
     * @param reason The reason of the stop.
     *
     * @returns Promise<Pagination>
     * */
    stop(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isCreated)
                throw new Error("stop(): Pagination isn't created yet. If you aren't already, await the create function.");
            if (!this.collector || this.ended)
                throw new Error("stop(): Can't stop as the paginator already ended or the collector has been stopped.");
            if (!this.collector.ended)
                this.collector.stop(reason);
            this.ended = true;
            yield this.updateContent();
            this.emit("end", reason);
            return this;
        });
    }
    /**
     * Goes to a page instantly.
     *
     * @param page The page to go to. Must be within the maximum dataset length.
     *
     * @returns Promise<Pagination>
     * */
    setPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isCreated)
                throw new Error("setPage(): Pagination isn't created yet. If you aren't already, await the create function.");
            if (!this.maxPage)
                throw new TypeError("setPage(): Pagination.maxPage is not defined.");
            if (this.maxPage < page)
                throw new TypeError("setPage(): Pagination.maxPage is greater than specified page.");
            if (page <= 0)
                throw new TypeError("setPage(): page parameter is less or equal to 0.");
            this.page = page;
            yield this.updateContent();
            return this;
        });
    }
}
exports.Pagination = Pagination;
//# sourceMappingURL=Pagination.js.map