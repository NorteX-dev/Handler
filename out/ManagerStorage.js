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
exports.ManagerStorage = void 0;
var ManagerStorage = /** @class */ (function (_super) {
    __extends(ManagerStorage, _super);
    function ManagerStorage() {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return _super.apply(this, options) || this;
    }
    ManagerStorage.prototype.add = function (element) {
        this.push(element);
    };
    ManagerStorage.prototype.getByName = function (name) {
        return this.find(function (element) { return element.name === name; });
    };
    ManagerStorage.prototype.exists = function (name) {
        return this.getByName(name) !== undefined;
    };
    return ManagerStorage;
}(Array));
exports.ManagerStorage = ManagerStorage;
