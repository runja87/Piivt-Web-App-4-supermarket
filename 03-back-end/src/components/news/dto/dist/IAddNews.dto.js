"use strict";
exports.__esModule = true;
exports.AddNewsValidator = void 0;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
var AddNewsValidator = ajv.compile({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 4,
            maxLength: 32
        },
        content: {
            type: "string"
        },
        altText: {
            type: "string",
            maxLength: 64
        }
    },
    required: [
        "title",
        "content",
    ],
    additionalProperties: true
});
exports.AddNewsValidator = AddNewsValidator;
