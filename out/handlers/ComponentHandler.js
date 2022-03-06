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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentHandler = void 0;
var Handler_1 = require("./Handler");
var glob_1 = require("glob");
var path = require("path");
var DirectoryReferenceError_1 = require("../errors/DirectoryReferenceError");
var index_1 = require("../index");
var ComponentHandler = /** @class */ (function (_super) {
    __extends(ComponentHandler, _super);
    function ComponentHandler(options) {
        var _this = _super.call(this, options) || this;
        if (!options.client)
            throw new ReferenceError("ComponentHandler(): options.client is required.");
        _this.client = options.client;
        _this.directory = options.directory ? path.join(process.cwd(), options.directory) : undefined;
        _this.components = new Map();
        if (options.autoLoad === undefined || !options.autoLoad)
            _this.loadComponents();
        return _this;
    }
    /**
     * Loads component interactions into memory
     *
     * @returns ComponentHandler
     *
     * @remarks
     * Requires @see {@link InteractionHandler.setDirectory} to be executed first, or `directory` to be specified in the constructor.
     * Run {@link ComponentHandler.runComponent()} to be invoked to run the ocmmand on an event.
     * */
    ComponentHandler.prototype.loadComponents = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.directory)
                    return [2 /*return*/, reject(new DirectoryReferenceError_1.default("Components directory is not set. Use setDirectory(path) prior."))];
                (0, glob_1.glob)(path.join(process.cwd(), this.directory), {}, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, files_1, file, parsedPath, ComponentFile, component;
                    return __generator(this, function (_a) {
                        if (err)
                            throw err;
                        this.debug("Found ".concat(files.length, " component files."));
                        if (err)
                            return [2 /*return*/, reject(new DirectoryReferenceError_1.default("Supplied components directory is invalid. Please ensure it exists and is absolute."))];
                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                            file = files_1[_i];
                            parsedPath = path.parse(file);
                            ComponentFile = require(file);
                            if (!ComponentFile)
                                return [2 /*return*/, this.debug("".concat(parsedPath, " failed to load. The file was loaded but cannot be required."))];
                            // Check if is class
                            if (!this.localUtils.isClass(ComponentFile))
                                throw new TypeError("Interaction ".concat(parsedPath.name, " doesn't export any of the correct classes."));
                            component = new ComponentFile(this, parsedPath.name.toLowerCase());
                            // Check if initialized class is extending Command
                            if (!(component instanceof index_1.ComponentInteraction))
                                throw new TypeError("Component file: ".concat(parsedPath.name, " doesn't extend ComponentInteraction. Use InteractionHandler to handle interactions like commands and context menus."));
                            // Save command to map
                            // @ts-ignore - Fine to ignore since it's never going to be verified
                            this.components.set(component.name, component);
                            this.debug("Loaded component \"".concat(component.name, "\" from file \"").concat(parsedPath.base, "\"."));
                            this.emit("load", component);
                        }
                        this.emit("ready");
                        resolve(this.components);
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    /**
     * Attempts to run the interaction. Returns a promise with the interaction if run succeeded, or rejects with an execution error.
     *
     * @returns Promise<Interaction>
     *
     * */
    ComponentHandler.prototype.runComponent = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (res, rej) {
            if (interaction.user.bot)
                return rej("Bot users can't run component interactions.");
            if (!(interaction.isCommand() || interaction.isContextMenu())) {
                _this.handleComponent.apply(_this, __spreadArray([interaction], additionalOptions, false)).then(res)
                    .catch(rej);
            }
            else {
                throw new Error("ComponentHandler#runComponent(): Unsupported interaction type. This only supports components. You should check the type beforehand, or refer to InteractionHandler() to handle commands & context menus.");
            }
        });
    };
    ComponentHandler.prototype.handleComponent = function (interaction) {
        var _this = this;
        var additionalOptions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additionalOptions[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var componentsArray, componentInteraction;
            return __generator(this, function (_a) {
                componentsArray = Array.from(this.components.values());
                componentInteraction = componentsArray.find(function (componentObject) {
                    if (componentObject.queryingMode === "exact")
                        return componentObject.customId === interaction.customId;
                    if (componentObject.queryingMode === "includes")
                        return interaction.customId.includes(componentObject.customId);
                    if (componentObject.queryingMode === "startsWith")
                        return interaction.customId.startsWith(componentObject.customId);
                    return false;
                });
                if (!componentInteraction)
                    return [2 /*return*/];
                this.debug("Found matching interaction with the queryingMode " + componentInteraction.queryingMode + ": " + componentInteraction.customId);
                if (!componentInteraction)
                    return [2 /*return*/];
                try {
                    componentInteraction.run.apply(componentInteraction, __spreadArray([interaction], additionalOptions, false));
                    resolve(componentInteraction);
                }
                catch (ex) {
                    console.error(ex);
                    reject(ex);
                }
                return [2 /*return*/];
            });
        }); });
    };
    return ComponentHandler;
}(Handler_1.Handler));
exports.ComponentHandler = ComponentHandler;
