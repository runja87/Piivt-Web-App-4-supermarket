import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();
addFormats(ajv);


export interface IRequestResetPasswordDto  {

    email: string;
}


const RequestResetPasswordValidator = ajv.compile({
    type: "object",
    properties: {


        email: {
            type: "string",
            format: "email",
            
        },
  
      
    },
    required: [
        "email",
    ],
    additionalProperties: false,
});


export { RequestResetPasswordValidator };