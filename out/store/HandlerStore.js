"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HandlerStore extends Array {
    constructor(handler) {
        super();
        this.handler = handler;
    }
    add(element) {
        this.push(element);
        return element;
    }
    getByName(name) {
        return this.find((e) => e.name === name);
    }
}
exports.default = HandlerStore;
//# sourceMappingURL=HandlerStore.js.map