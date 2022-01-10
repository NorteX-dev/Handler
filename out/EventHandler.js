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
exports.EventHandler = void 0;
const events_1 = require("events");
const LocalUtils_1 = require("./LocalUtils");
const glob_1 = require("glob");
const path = require("path");
const index_1 = require("./index");
const EventsDirectoryReferenceError_1 = require("./errors/EventsDirectoryReferenceError");
class EventHandler extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (!options.client)
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        this.client = options.client;
        this.directory = options.directory;
        this.events = new Map();
        this.localUtils = new LocalUtils_1.LocalUtils(this, this.client);
        if (options.autoLoad !== false)
            this.loadEvents();
        return this;
    }
    /*
     * Sets directory for commands
     *
     * @param commandDir Directory to look for while loading commands
     * @returns CommandHandler
     *
     * @remarks
     * This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     * */
    setEventsDirectory(absolutePath) {
        if (!absolutePath)
            throw new EventsDirectoryReferenceError_1.default("absolutePath parameter is required.");
        this.directory = absolutePath;
        return this;
    }
    /*
     * Loads classic message commands into memory
     *
     * @returns CommandHandler
     *
     * @remarks
     * Requires @see {CommandHandler.setCommandDirectory} to be executed first, or commandDirectory to be specified in the CommandHandler constructor.
     * */
    loadEvents() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!this.directory)
                return reject(new EventsDirectoryReferenceError_1.default("Events directory is not set. Use setEventsdirectory(path) prior."));
            (0, glob_1.glob)(this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js", (err, files) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return reject(new EventsDirectoryReferenceError_1.default("Supplied events directory is invalid. Please ensure it exists and is absolute."));
                for (const file of files) {
                    delete require.cache[file];
                    const parsedPath = path.parse(file);
                    let EventFile;
                    try {
                        // Attempt CJS import
                        EventFile = require(file);
                    }
                    catch (_a) {
                        // Attempt ESM import
                        EventFile = Promise.resolve().then(() => require(file));
                    }
                    if (!EventFile)
                        return this.emit("dubug", `${parsedPath} failed to load.`);
                    if (!this.localUtils.isClass(EventFile))
                        throw new TypeError(`Event ${parsedPath.name} doesn't export any classes.`);
                    const event = new EventFile(this, this.client, parsedPath.name.toLowerCase());
                    if (!(event instanceof index_1.Event))
                        throw new TypeError(`Event file: ${parsedPath.name} doesn't extend the Event class.`);
                    this.client[event.once ? "once" : "on"](event.name, (...args) => {
                        event.run(...args);
                    });
                    this.emit("debug", `Set event "${event.name}" from file "${parsedPath.base}"`);
                    this.emit("load", event);
                }
                this.emit("ready");
                resolve(this.events);
            }));
        }));
    }
}
exports.EventHandler = EventHandler;
