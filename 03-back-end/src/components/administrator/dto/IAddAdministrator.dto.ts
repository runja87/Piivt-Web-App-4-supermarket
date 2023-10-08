import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();
addFormats(ajv);


export interface IAddAdministratorDto  {
    username: string;
    email: string;
    password: string;

}
export default interface IAddAdministrator extends IServiceData {
    username: string;
    email: string;
    password_hash: string;
    password_reset_code?: string;
    password_reset_link?: string;

}


const AddAdministratorValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            pattern: "^[a-z0-9]{4,64}$" // small letters and numbers from 4-64 characters
        },

        email: {
            type: "string",
            format: "email",
            
        },
        password: {
            type: "string",
            pattern: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[\\s])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\".,<>/~`]).*$" // min 8 characters, at least one capital, number, special character, space and any other char or special letters
        },

    },
    required: [
        "username",
        "email",
        "password",
    ],
    additionalProperties: false,
});


export { AddAdministratorValidator };