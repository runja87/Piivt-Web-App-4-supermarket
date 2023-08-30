"use strict";
exports.__esModule = true;
exports.EditAdministratorValidator = void 0;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
var EditAdministratorValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            pattern: "^[a-z]{4,32}$"
        },
        email: {
            type: "string",
            pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$"
        },
        password: {
            type: "string",
            pattern: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[\\s])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\".,<>/~`]).*$" // min 8 char, at least one capital, number, special character, space and any other char or special letters
        },
        isActive: {
            type: "boolean"
        }
    },
    required: [
        "username",
        "email",
        "password",
    ],
    additionalProperties: false
});
exports.EditAdministratorValidator = EditAdministratorValidator;
