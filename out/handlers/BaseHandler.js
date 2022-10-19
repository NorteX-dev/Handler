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
var DirectoryReferenceError_1 = require("../errors/DirectoryReferenceError");
var events_1 = require("events");
var Verificators_1 = require("../util/Verificators");
var path = require("path");
var fs = require("fs");
var BaseHandler = /** @class */ (function (_super) {
    __extends(BaseHandler, _super);
    function BaseHandler(options) {
        var _this = _super.call(this) || this;
        if (!options.client)
            throw new ReferenceError("BaseHandler(): options.client is required.");
        _this.client = options.client;
        if (options.directory)
            _this.setDirectory(options.directory);
        return _this;
    }
    /**
     * Sets (absolute) directory for commands
     *
     * @remarks This directory includes all children directories too.
     * @see {@link https://www.npmjs.com/package/glob} for information on how directories are parsed
     *
     * @returns CommandHandler
     * @param value
     * */
    BaseHandler.prototype.setDirectory = function (value) {
        if (!value)
            throw new DirectoryReferenceError_1.default("setDirectory(): 'value' parameter is required.");
        if (!fs.existsSync(value))
            throw new DirectoryReferenceError_1.default("setDirectory(...): Directory ".concat(value, " does not exist."));
        this.directory = value;
        return this;
    };
    BaseHandler.prototype.debug = function (message) {
        this.emit("debug", message);
    };
    BaseHandler.prototype.load = function (emitReady) {
        var _this = this;
        if (emitReady === void 0) { emitReady = true; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var instances;
            var _this = this;
            return __generator(this, function (_a) {
                this.debug("Loading files from ".concat(this.directory, "."));
                instances = [];
                if (!this.directory)
                    return [2 /*return*/, reject(new DirectoryReferenceError_1.default("Directory is not set. Use setDirectory(path) or specify a 'directory' key to the constructor prior to loading."))];
                if (!fs.existsSync(this.directory))
                    return [2 /*return*/, reject(new DirectoryReferenceError_1.default("Directory \"".concat(this.directory, "\" does not exist.")))];
                console.log(this.directory);
                this.loadFiles(this.directory)
                    .then(function (files) {
                    console.log("fi", files);
                    if (!files.length)
                        _this.debug("No files found in supplied directory.");
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var file = files_1[_i];
                        var parsedPath = path.parse(file);
                        var Constructor = require(file);
                        if (!Constructor)
                            return _this.debug("".concat(parsedPath, " failed to load. The file was loaded but cannot be required."));
                        if (!Verificators_1.default.isClass(Constructor))
                            throw new TypeError("File ".concat(parsedPath.name, " doesn't export a class."));
                        var instance = new Constructor(_this, parsedPath.name);
                        _this.debug("Loaded \"".concat(instance.customId || instance.name, "\" from file ").concat(parsedPath.name).concat(parsedPath.ext, "."));
                        instances.push(instance);
                    }
                    if (emitReady)
                        _this.emit("ready");
                    resolve(instances);
                })
                    .catch(function (err) {
                    return reject(new DirectoryReferenceError_1.default("Error while loading files: " + err.message));
                });
                return [2 /*return*/];
            });
        }); });
    };
    BaseHandler.prototype.loadFiles = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.readdir(directory, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                            var filelist;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err)
                                            return [2 /*return*/, reject(err)];
                                        filelist = [];
                                        return [4 /*yield*/, Promise.all(files.map(function (fileOrDir) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, _b;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            if (!fs.statSync(path.join(directory, fileOrDir)).isDirectory()) return [3 /*break*/, 2];
                                                            _b = (_a = filelist).concat;
                                                            return [4 /*yield*/, this.loadFiles(path.join(directory, fileOrDir))];
                                                        case 1:
                                                            filelist = _b.apply(_a, [_c.sent()]);
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            filelist.push(path.join(directory, fileOrDir));
                                                            _c.label = 3;
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); }))];
                                    case 1:
                                        _a.sent();
                                        resolve(filelist);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    return BaseHandler;
}(events_1.EventEmitter));
exports.default = BaseHandler;
