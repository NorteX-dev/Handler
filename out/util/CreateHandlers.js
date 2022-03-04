"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createHandlers(handlerClasses, data) {
    var handlers = [];
    handlerClasses.forEach(function (HandlerClass) {
        // @ts-ignore
        handlers.push(new HandlerClass(data));
    });
    return handlers;
}
exports.default = createHandlers;
