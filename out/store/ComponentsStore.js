"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ComponentsStore extends Array {
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
    getByCid(customId) {
        return this.find((e) => e.customId === customId);
    }
}
exports.default = ComponentsStore;
//# sourceMappingURL=ComponentsStore.js.map