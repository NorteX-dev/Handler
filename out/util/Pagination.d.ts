/// <reference types="node" />
import { EventEmitter } from "events";
import { TextBasedChannel } from "discord.js";
export default class Pagination extends EventEmitter {
    private collector?;
    page: number;
    dataset?: Array<any>;
    currentPageDataset?: Array<any>;
    perPage?: number;
    channel?: TextBasedChannel;
    maxPage: number;
    ended: boolean;
    isCreated: boolean;
    private messageRef?;
    private readonly randomId;
    private readonly ids;
    constructor();
    private constructEmbed;
    private updateContent;
    create(dataset: Array<any>, channel: TextBasedChannel, initiatorId: string, perPage?: number, time?: number): Promise<this>;
    /**
     * Stops the pagination with an optional reason.
     *
     * @param reason The reason of the stop.
     *
     * @returns Promise<Pagination>
     * */
    stop(reason?: string): Promise<this>;
    /**
     * Goes to a page instantly.
     *
     * @param page The page to go to. Must be within the maximum dataset length.
     *
     * @returns Promise<Pagination>
     * */
    setPage(page: number): Promise<this>;
}
