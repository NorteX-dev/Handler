/// <reference types="node" />
import { EventEmitter } from "events";
import { TextBasedChannels } from "discord.js";
export declare class Pagination extends EventEmitter {
    private collector?;
    page: number;
    dataset?: Array<any>;
    currentPageDataset?: Array<any>;
    perPage?: number;
    channel?: TextBasedChannels;
    maxPage: number;
    ended: boolean;
    isCreated: boolean;
    private messageRef?;
    private readonly randomId;
    private readonly ids;
    constructor();
    private constructEmbed;
    private updateContent;
    create(dataset: Array<any>, channel: TextBasedChannels, initiatorId: string, perPage?: number, time?: number): Promise<this>;
    stop(reason?: string): Promise<this>;
    setPage(page: number): Promise<this>;
}
