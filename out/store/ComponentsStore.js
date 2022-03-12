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
var ComponentsStore = /** @class */ (function (_super) {
    __extends(ComponentsStore, _super);
    function ComponentsStore() {
        return _super.call(this) || this;
    }
    Object.defineProperty(ComponentsStore.prototype, "size", {
        get: function () {
            return this.length;
        },
        enumerable: false,
        configurable: true
    });
    ComponentsStore.prototype.add = function (element) {
        this.push(element);
        return element;
    };
    ComponentsStore.prototype.remove = function (element) {
        if (this.indexOf(element) === -1)
            return false;
        this.splice(this.indexOf(element), 1);
        return true;
    };
    ComponentsStore.prototype.getByCid = function (customId) {
        return this.find(function (e) { return e.customId === customId; });
    };
    return ComponentsStore;
}(Array));
exports.default = ComponentsStore;
