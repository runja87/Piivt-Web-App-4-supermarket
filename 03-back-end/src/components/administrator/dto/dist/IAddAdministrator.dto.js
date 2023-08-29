"use strict";
exports.__esModule = true;
exports.AddAdministratorValidator = void 0;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
var AddAdministratorValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            pattern: "^[a-z]{4,32}$" // small letters from 4-32 characters
        },
        email: {
            type: "string",
            pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$"
        },
        password_hash: {
            type: "string",
            pattern: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[\\s])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\".,<>/~`]).*$" // min 8 char, at least one capital, number, special character, space and any other char or special letters
        }
    },
    required: [
        "username",
        "email",
        "password_hash",
    ],
    additionalProperties: false
});
exports.AddAdministratorValidator = AddAdministratorValidator;
