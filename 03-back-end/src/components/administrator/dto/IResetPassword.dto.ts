import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();
addFormats(ajv);


export interface IResetPasswordDto  {
    
    password1: string;
    password2: String;
   

}
export default interface IResetPassword extends IServiceData {
  
    password_hash: string;

}


const ResetPasswordValidator = ajv.compile({
    type: "object",
    properties: {
 
        password1: {
            type: "string",
            pattern: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[\\s])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\".,<>/~`]).*$" // min 8 char, at least one capital, number, special character, space and any other char or special letters
        },
        password2: {
            type: "string",
            pattern: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[\\s])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\".,<>/~`]).*$" // min 8 char, at least one capital, number, special character, space and any other char or special letters
        },
      
    },
    required: [
        "password1",
        "password2"
    ],
    additionalProperties: false,
});


export { ResetPasswordValidator };