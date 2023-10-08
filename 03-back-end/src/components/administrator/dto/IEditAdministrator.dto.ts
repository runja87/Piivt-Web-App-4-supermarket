import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();
addFormats(ajv);


export interface IEditAdministratorDto  {
    username?: string;
    email?: string;
    password?: string;
    isActive?: boolean;

}
export default interface IEditAdministrator extends IServiceData {
    username?: string;
    email?: string;
    password_hash?: string;
    is_active?: number;
    password_reset_link?: string;
    password_reset_code?: string;

}


const EditAdministratorValidator = ajv.compile({
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
            pattern: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[\\s])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\".,<>/~`]).*$" // min 8 char, at least one capital, number, special character, space and any other char or special letters
        },
        isActive: {
            type: "boolean",
        }
    },
    required: [
    
    ],
    additionalProperties: false,
});


export { EditAdministratorValidator };