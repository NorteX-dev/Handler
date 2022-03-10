"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandsStore extends Array {
    constructor() {
        super();
    }
    get size() {
        return this.length;
    }
    add(element) {
        this.push(element);
        return element;
    }
    remove(element) {
        if (this.indexOf(element) === -1)
            return false;
        this.splice(this.indexOf(element), 1);
        return true;
    }
    get(name) {
        return this.find((e) => e.name === name);
    }
}
exports.default = CommandsStore;
//# sourceMappingURL=CommandsStore.js.map