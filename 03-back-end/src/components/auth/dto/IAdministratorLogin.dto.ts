import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv();
addFormats(ajv);

export interface IAdministratorLoginDto{
    username: string;
    password: string;
}


const IAdministratorLoginValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            pattern: "^[a-z0-9]{4,64}$" // small letters and numbers from 4-64 characters
        },

        password: {
            type: "string",
            pattern: "^(?=.[A-Z])(?=.[0-9])(?=.[\\s])(?=.[!@#$%^&()_+\\-=[\\]{};':\".,<>/~`]).$" // min 8 characters, at least one capital, number, special character, space and any other char or special letters
        },

    },
    required: [
        "username",
        "password",
    ],
    additionalProperties: false,
});


export { IAdministratorLoginValidator };