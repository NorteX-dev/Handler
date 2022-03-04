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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
var DirectoryReferenceError_1 = require("../errors/DirectoryReferenceError");
var events_1 = require("events");
var path = require("path");
var Handler = /** @class */ (function (_super) {
    __extends(Handler, _super);
    function Handler(options) {
        var _this = _super.call(this) || this;
        if (!options.client)
            throw new ReferenceError("Handler(): options.client is required.");
        _this.client = options.client;
        _this.directory = options.directory;
        return _this;
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
    Handler.prototype.setDirectory = function (value) {
        if (!value)
            throw new DirectoryReferenceError_1.default("setDirectory(): path parameter is required.");
        this.directory = path.join(process.cwd(), value);
        return this;
    };
    return Handler;
}(events_1.EventEmitter));
exports.Handler = Handler;
