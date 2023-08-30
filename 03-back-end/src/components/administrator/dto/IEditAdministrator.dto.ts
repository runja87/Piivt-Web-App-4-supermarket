import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();


export interface IEditAdministratorDto  {
    username: string;
    email: string;
    password: string;
    isActive?: boolean;

}
export default interface IEditAdministrator extends IServiceData {
    username: string;
    email: string;
    password_hash: string;
    is_active?: number;

}


const EditAdministratorValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            pattern: "^[a-z]{4,32}$" 
        },

        email: {
            type: "string",
            pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$",
            
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
        "username",
        "email",
        "password",
    ],
    additionalProperties: false,
});


export { EditAdministratorValidator };