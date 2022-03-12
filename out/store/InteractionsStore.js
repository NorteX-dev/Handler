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
var InteractionsStore = /** @class */ (function (_super) {
    __extends(InteractionsStore, _super);
    function InteractionsStore() {
        return _super.call(this) || this;
    }
    Object.defineProperty(InteractionsStore.prototype, "size", {
        get: function () {
            return this.length;
        },
        enumerable: false,
        configurable: true
    });
    InteractionsStore.prototype.add = function (element) {
        this.push(element);
        return element;
    };
    InteractionsStore.prototype.remove = function (element) {
        if (this.indexOf(element) === -1)
            return false;
        this.splice(this.indexOf(element), 1);
        return true;
    };
    InteractionsStore.prototype.getByName = function (name) {
        return this.find(function (e) { return e.name === name; });
    };
    InteractionsStore.prototype.getByNameAndType = function (name, type) {
        return this.find(function (e) { return e.name === name && e.type === type; });
    };
    return InteractionsStore;
}(Array));
exports.default = InteractionsStore;
