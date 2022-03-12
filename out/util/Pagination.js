"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
var events_1 = require("events");
var discord_js_1 = require("discord.js");
var nanoid_1 = require("nanoid");
var Pagination = /** @class */ (function (_super) {
    __extends(Pagination, _super);
    function Pagination() {
        var _this = _super.call(this) || this;
        _this.page = 1;
        _this.ended = false;
        _this.maxPage = 0;
        _this.isCreated = false;
        _this.randomId = (0, nanoid_1.nanoid)();
        _this.ids = ["PREVIOUS", "NEXT", "GOTO", "STOP"];
        _this.ids = _this.ids.map(function (i) { return "PAGINATION_" + i + "_".concat(_this.randomId); });
        return _this;
    }
    Pagination.prototype.constructEmbed = function () {
        if (!this.dataset || !this.dataset.length)
            throw new Error("cnstructEmbed(): Can't construct embed with data as the dataset is empty.");
        var perPage = this.perPage || 10;
        var dataset = this.dataset;
        dataset = dataset.map(function (el, i) { return "**".concat(i + 1, "**. ").concat(el); });
        var dataFromPage = dataset.slice((this.page - 1) * perPage, this.page * perPage);
        this.currentPageDataset = dataset.slice((this.page - 1) * perPage, this.page * perPage);
        var embed = new discord_js_1.MessageEmbed();
        embed.setDescription(dataFromPage.join("\n")).setFooter({ text: "Page ".concat(this.page, "/").concat(this.maxPage) });
        return embed;
    };
    Pagination.prototype.updateContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var row, _a, msg_1, msg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton({ label: "<", style: "PRIMARY", customId: this.ids[0] }), new discord_js_1.MessageButton({ label: ">", style: "PRIMARY", customId: this.ids[1] }), new discord_js_1.MessageButton({ label: "Go to Page", style: "SECONDARY", customId: this.ids[2] }), new discord_js_1.MessageButton({ label: "Stop", style: "DANGER", customId: this.ids[3] }));
                        if (!!this.messageRef) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.channel.send({ embeds: [this.constructEmbed()], components: [row] })];
                    case 1:
                        _a.messageRef = _b.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        if (!this.ended) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.channel.messages.fetch(this.messageRef.id).catch(function () { })];
                    case 3:
                        msg_1 = _b.sent();
                        if (!msg_1)
                            return [2 /*return*/];
                        return [4 /*yield*/, msg_1.edit({ embeds: [this.constructEmbed()], components: [] })];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                    case 5: return [4 /*yield*/, this.channel.messages.fetch(this.messageRef.id).catch(function () { })];
                    case 6:
                        msg = _b.sent();
                        if (!msg)
                            return [2 /*return*/, this.stop("Pagination message got deleted or is inaccessible.")];
                        return [4 /*yield*/, msg.edit({ embeds: [this.constructEmbed()], components: [row] })];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /* ------------------ BEING PUBLIC METHODS ------------------ */
    Pagination.prototype.create = function (dataset, channel, initiatorId, perPage, time) {
        if (perPage === void 0) { perPage = 10; }
        if (time === void 0) { time = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var filter;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (Array.isArray(dataset))
                            this.dataset = dataset;
                        else
                            this.dataset = [dataset];
                        if (!this.dataset || !this.dataset.length)
                            throw new Error("create(): Can't create pagination as the specified dataset is empty.");
                        this.perPage = perPage;
                        this.channel = channel;
                        this.maxPage = Math.ceil(this.dataset.length / this.perPage);
                        filter = function (interaction) {
                            return interaction.user.id === initiatorId && _this.ids.includes(interaction.customId);
                        };
                        return [4 /*yield*/, this.updateContent()];
                    case 1:
                        _a.sent();
                        this.isCreated = true;
                        this.collector = channel.createMessageComponentCollector({ filter: filter, idle: time });
                        this.collector.on("collect", function (interaction) { return __awaiter(_this, void 0, void 0, function () {
                            var gotoPageCollector;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(interaction.customId === this.ids[0])) return [3 /*break*/, 2];
                                        if (!(this.page > 1)) return [3 /*break*/, 2];
                                        interaction.deferUpdate();
                                        this.page--;
                                        return [4 /*yield*/, this.updateContent()];
                                    case 1:
                                        _a.sent();
                                        this.emit("change", { next: true, previous: false, page: this.page, maxPage: this.maxPage, perPage: this.perPage, results: this.currentPageDataset });
                                        _a.label = 2;
                                    case 2:
                                        if (!(interaction.customId === this.ids[1])) return [3 /*break*/, 4];
                                        if (!(this.page < this.maxPage)) return [3 /*break*/, 4];
                                        interaction.deferUpdate();
                                        this.page++;
                                        return [4 /*yield*/, this.updateContent()];
                                    case 3:
                                        _a.sent();
                                        this.emit("change", { next: false, previous: true, page: this.page, maxPage: this.maxPage, perPage: this.perPage, results: this.currentPageDataset });
                                        _a.label = 4;
                                    case 4:
                                        if (!(interaction.customId === this.ids[2])) return [3 /*break*/, 6];
                                        gotoPageCollector = this.channel.createMessageCollector({ filter: function (m) { return m.author.id === initiatorId && !isNaN(parseInt(m.content)); }, max: 1, time: 30000 });
                                        return [4 /*yield*/, interaction.reply({ embeds: [new discord_js_1.MessageEmbed().setDescription("Please type in the page you want to go to.")], ephemeral: true })];
                                    case 5:
                                        _a.sent();
                                        gotoPageCollector.on("collect", function (gt) { return __awaiter(_this, void 0, void 0, function () {
                                            var page;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        page = parseInt(gt.content);
                                                        gt.delete().catch(function () { });
                                                        if (page > this.maxPage) {
                                                            interaction.editReply({ embeds: [new discord_js_1.MessageEmbed().setColor("RED").setDescription("This page doesn't exist. Pages go only up to ".concat(this.maxPage, "."))] });
                                                            return [2 /*return*/];
                                                        }
                                                        if (page <= 0) {
                                                            interaction.editReply({ embeds: [new discord_js_1.MessageEmbed().setColor("RED").setDescription("Page cannot be 0 or less.")] });
                                                            return [2 /*return*/];
                                                        }
                                                        this.page = page;
                                                        return [4 /*yield*/, this.updateContent()];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, interaction.editReply({ embeds: [new discord_js_1.MessageEmbed().setColor("GREEN").setDescription("Page updated.")] })];
                                                    case 2:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        _a.label = 6;
                                    case 6:
                                        if (!(interaction.customId === this.ids[3])) return [3 /*break*/, 8];
                                        return [4 /*yield*/, interaction.deferUpdate()];
                                    case 7:
                                        _a.sent();
                                        this.collector.stop("User requested stop.");
                                        _a.label = 8;
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.collector.on("end", function (collected, reason) {
                            _this.stop(reason !== "idle" ? reason : "Pagination timed out.");
                        });
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Stops the pagination with an optional reason.
     *
     * @param reason The reason of the stop.
     *
     * @returns Promise<Pagination>
     * */
    Pagination.prototype.stop = function (reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isCreated)
                            throw new Error("stop(): Pagination isn't created yet. If you aren't already, await the create function.");
                        if (!this.collector || this.ended)
                            throw new Error("stop(): Can't stop as the paginator already ended or the collector has been stopped.");
                        if (!this.collector.ended)
                            this.collector.stop(reason);
                        this.ended = true;
                        return [4 /*yield*/, this.updateContent()];
                    case 1:
                        _a.sent();
                        this.emit("end", reason);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Goes to a page instantly.
     *
     * @param page The page to go to. Must be within the maximum dataset length.
     *
     * @returns Promise<Pagination>
     * */
    Pagination.prototype.setPage = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isCreated)
                            throw new Error("setPage(): Pagination isn't created yet. If you aren't already, await the create function.");
                        if (!this.maxPage)
                            throw new TypeError("setPage(): Pagination.maxPage is not defined.");
                        if (this.maxPage < page)
                            throw new TypeError("setPage(): Pagination.maxPage is greater than specified page.");
                        if (page <= 0)
                            throw new TypeError("setPage(): page parameter is less or equal to 0.");
                        this.page = page;
                        return [4 /*yield*/, this.updateContent()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    return Pagination;
}(events_1.EventEmitter));
exports.Pagination = Pagination;
