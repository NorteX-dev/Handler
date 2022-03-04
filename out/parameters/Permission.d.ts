export default class Option {
    type: string;
    name: string;
    description: string;
    required: boolean;
    autocomplete?: any;
    choices?: any;
    options?: any;
    channelTypes?: any;
    constructor(type: string, name: string, description: string, required: boolean, autocomplete: any, choices: any, options: any, channelTypes: any);
    toJSON(): {
        type: string;
        name: string;
        description: string;
        required: boolean;
        autocomplete: any;
        choices: any;
        options: any;
        channelTypes: any;
    };
}
