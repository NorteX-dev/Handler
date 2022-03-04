"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Option = /** @class */ (function () {
    function Option(type, name, description, required, autocomplete, choices, options, channelTypes) {
        console.log("getting data");
        this.type = type || "STRING";
        this.name = name;
        this.description = description;
        this.required = required || false;
        this.autocomplete = autocomplete;
        this.choices = choices;
        this.options = options;
        this.channelTypes = channelTypes;
        if (!name || !description)
            throw new Error("All options must have a name and description");
    }
    Option.prototype.toJSON = function () {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            required: this.required,
            autocomplete: this.autocomplete,
            choices: this.choices,
            options: this.options,
            channelTypes: this.channelTypes,
        };
    };
    return Option;
}());
exports.default = Option;
