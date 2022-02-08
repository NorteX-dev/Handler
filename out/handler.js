"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
var CommandDirectoryReferenceError_1 = require("./errors/CommandDirectoryReferenceError");
var Handler = /** @class */ (function () {
    function Handler(options) {
        this.client = options.client;
        this.commandDirectory = options.commandDir;
    }
    Handler.prototype.setCommandDirectory = function (commandDir) {
        if (!commandDir)
            throw new CommandDirectoryReferenceError_1.default();
        this.commandDirectory = commandDir;
    };
    return Handler;
}());
exports.Handler = Handler;
