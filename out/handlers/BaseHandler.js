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
exports.BaseHandler = void 0;
const DirectoryReferenceError_1 = require("../errors/DirectoryReferenceError");
const events_1 = require("events");
const path = require("path");
const fs = require("fs");
class BaseHandler extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.files = [];
        if (!options.client)
            throw new ReferenceError("BaseHandler(): options.client is required.");
        this.client = options.client;
        if (options.directory)
            this.setDirectory(options.directory);
        return this;
    }
    setDirectory(value) {
        if (!value)
            throw new DirectoryReferenceError_1.DirectoryReferenceError("setDirectory(): 'value' parameter is required.");
        if (!fs.existsSync(value))
            throw new DirectoryReferenceError_1.DirectoryReferenceError(`setDirectory(...): Directory ${value} does not exist.`);
        this.directory = value;
        return this;
    }
    debug(message) {
        this.emit("debug", message);
    }
    load(emitReady = true) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.debug(`Loading files from ${this.directory}.`);
            let instances = [];
            if (!this.directory)
                return reject(new DirectoryReferenceError_1.DirectoryReferenceError("Directory is not set. Use setDirectory(path) or specify a 'directory' key to the constructor prior to loading."));
            if (!fs.existsSync(this.directory))
                return reject(new DirectoryReferenceError_1.DirectoryReferenceError(`Directory "${this.directory}" does not exist.`));
            this.loadAndPopulateFiles(this.directory);
            if (!this.files.length)
                this.debug("No files found in supplied directory.");
            else
                this.debug("Files found:\n" + this.files.map((f) => `- ${f}`).join("\n"));
            for (const file of this.files) {
                if (file.endsWith(".map")) {
                    continue;
                }
                const parsedPath = path.parse(file);
                const MConstructor = yield Promise.resolve(`${file}`).then(s => require(s));
                let Constructor;
                Constructor = MConstructor.default ? MConstructor.default : MConstructor;
                if (!Constructor)
                    return this.debug(`The module ${parsedPath} failed to import. The file does not have a default export or module.exports.`);
                // if (!Verificators.isClass(Constructor.default)) throw new TypeError(`File ${parsedPath.name} doesn't export a class.`);
                const instance = new Constructor(this, parsedPath.name);
                this.debug(`Loaded "${instance.customId || instance.name}" from file ${parsedPath.name}${parsedPath.ext}.`);
                instances.push(instance);
            }
            if (emitReady)
                this.emit("ready");
            resolve(instances);
        }));
    }
    loadAndPopulateFiles(directory) {
        const filesInDirectory = fs.readdirSync(directory);
        for (const file of filesInDirectory) {
            const absolute = path.join(directory, file);
            if (fs.statSync(absolute).isDirectory()) {
                this.loadAndPopulateFiles(absolute);
            }
            else {
                this.files.push(absolute);
            }
        }
    }
}
exports.BaseHandler = BaseHandler;
