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
/* Utility class for storing loaded values like Commands, Interactions and Component Interactions */
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store() {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return _super.apply(this, options) || this;
    }
    Store.prototype.add = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.push.apply(this, args);
    };
    Store.prototype.getByName = function (name) {
        // item -> command/interaction name or component customId
        return this.find(function (item) { return item.name === name; });
    };
    Store.prototype.exists = function (name) {
        return this.getByName(name) !== undefined;
    };
    return Store;
}(Array));
exports.default = Store;
