"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InteractionsStore extends Array {
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
    getByName(name) {
        return this.find((e) => e.name === name);
    }
    getByNameAndType(name, type) {
        return this.find((e) => e.name === name && e.type === type);
    }
}
exports.default = InteractionsStore;
