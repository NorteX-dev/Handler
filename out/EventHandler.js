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
exports.EventHandler = void 0;
var events_1 = require("events");
var LocalUtils_1 = require("./LocalUtils");
var glob_1 = require("glob");
var path = require("path");
var index_1 = require("./index");
var EventsDirectoryReferenceError_1 = require("./errors/EventsDirectoryReferenceError");
var EventHandler = /** @class */ (function (_super) {
    __extends(EventHandler, _super);
    function EventHandler(options) {
        var _this = _super.call(this) || this;
        if (!options.client)
            throw new ReferenceError("InteractionHandler(): options.client is required.");
        _this.client = options.client;
        _this.directory = options.directory;
        _this.enableDebug = options.debug || false;
        _this.events = new Map();
        _this.localUtils = new LocalUtils_1.LocalUtils(_this.client, true);
        if (options.autoLoad)
            _this.loadEvents();
        return _this;
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
    EventHandler.prototype.setEventsDirectory = function (absolutePath) {
        if (!absolutePath)
            throw new EventsDirectoryReferenceError_1.default("absolutePath parameter is required.");
        this.directory = absolutePath;
        return this;
    };
    /*
     * Loads classic message commands into memory
     *
     * @returns CommandHandler
     *
     * @remarks
     * Requires @see {CommandHandler.setCommandDirectory} to be executed first, or commandDirectory to be specified in the CommandHandler constructor.
     * */
    EventHandler.prototype.loadEvents = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.directory)
                    return [2 /*return*/, reject(new EventsDirectoryReferenceError_1.default("Events directory is not set. Use setEventsdirectory(path) prior."))];
                (0, glob_1.glob)(this.directory.endsWith("/") ? this.directory + "**/*.js" : this.directory + "/**/*.js", function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                    var _loop_1, this_1, _i, files_1, file;
                    return __generator(this, function (_a) {
                        if (err)
                            return [2 /*return*/, reject(new EventsDirectoryReferenceError_1.default("Supplied events directory is invalid. Please ensure it exists and is absolute."))];
                        _loop_1 = function (file) {
                            delete require.cache[file];
                            var parsedPath = path.parse(file);
                            var EventFile = require(file);
                            if (!this_1.localUtils.isClass(EventFile))
                                throw new TypeError("Event " + parsedPath.name + " doesn't export any classes.");
                            var event_1 = new EventFile(this_1, this_1.client, parsedPath.name.toLowerCase());
                            if (!(event_1 instanceof index_1.Event))
                                throw new TypeError("Event file: " + parsedPath.name + " doesn't extend the Event class.");
                            this_1.client[event_1.once ? "once" : "on"](event_1.name, function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                event_1.run.apply(event_1, args);
                            });
                            this_1.localUtils.debug("Set event \"" + event_1.name + "\" from file \"" + parsedPath.base + "\"");
                            this_1.emit("load", event_1);
                        };
                        this_1 = this;
                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                            file = files_1[_i];
                            _loop_1(file);
                        }
                        this.emit("ready");
                        resolve(this.events);
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    return EventHandler;
}(events_1.EventEmitter));
exports.EventHandler = EventHandler;