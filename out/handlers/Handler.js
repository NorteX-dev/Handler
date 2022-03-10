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
exports.Handler = void 0;
const DirectoryReferenceError_1 = require("../errors/DirectoryReferenceError");
const events_1 = require("events");
const path = require("path");
const glob_1 = require("glob");
const fs = require("fs");
const LocalUtils_1 = require("../util/LocalUtils");
class Handler extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (!options.client)
            throw new ReferenceError("Handler(): options.client is required.");
        this.client = options.client;
        this.localUtils = new LocalUtils_1.LocalUtils();
        if (options.directory)
            this.setDirectory(options.directory);
        return this;
    }
    /**
     * Sets directory for commands
     *
     * @remarks This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     *
     * @returns CommandHandler
     * @param value
     * */
    setDirectory(value) {
        if (!value)
            throw new DirectoryReferenceError_1.default("setDirectory(): 'path' parameter is required.");
        const dirPath = path.join(process.cwd(), value);
        if (!fs.existsSync(dirPath))
            throw new DirectoryReferenceError_1.default(`setDirectory(...): Directory ${dirPath} does not exist.`);
        this.directory = dirPath;
        return this;
    }
    debug(message) {
        this.emit("debug", message);
    }
    loadAndInstance(emitReady = true) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.debug(`Loading files from ${this.directory}.`);
            let instances = [];
            if (!this.directory)
                return reject(new DirectoryReferenceError_1.default("Directory is not set. Use setDirectory(path) or specify a 'directory' key to the constructor prior to loading."));
            if (!fs.existsSync(this.directory))
                return reject(new DirectoryReferenceError_1.default(`Directory "${this.directory}" does not exist.`));
            (0, glob_1.glob)(this.directory + "/**/*.js", (err, files) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return reject(new DirectoryReferenceError_1.default("Error while loading files: " + err.message));
                if (!files.length)
                    this.debug("No files found in supplied directory.");
                for (const file of files) {
                    const parsedPath = path.parse(file);
                    const Constructor = require(file);
                    if (!Constructor)
                        return this.debug(`${parsedPath} failed to load. The file was loaded but cannot be required.`);
                    if (!this.localUtils.isClass(Constructor))
                        throw new TypeError(`File ${parsedPath.name} doesn't export a class.`);
                    const instance = new Constructor(this, parsedPath.name);
                    this.debug(`Instantiated "${instance.customId || instance.name}" from file ${parsedPath.name}${parsedPath.ext}.`);
                    instances.push(instance);
                }
                if (emitReady)
                    this.emit("ready");
                resolve(instances);
            }));
        }));
    }
}
exports.Handler = Handler;
//# sourceMappingURL=Handler.js.map