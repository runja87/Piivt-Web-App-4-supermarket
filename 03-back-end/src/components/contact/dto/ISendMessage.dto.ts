import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();



export interface ISendMessageDto {
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    message: string;
    
}

export default interface ISendMessage extends IServiceData{
    firstname: string;
    lastname: string;
    email: string;
    title: string;
    message: string;
    
}



const SendMessageValidator = ajv.compile({
    type: "object",
    properties: {
        firstName: {
            type: "string",
            minLength: 4,
            maxLength: 64,
        },
        lastName: {
            type: "string",
            minLength: 4,
            maxLength: 64,
        },
     
        email: {
            type: "string",
            pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$",
        },
        title: {
            type: "string",
            minLength: 2,
            maxLength: 8,
        },
        message: {
            type: "string",
            minLength: 100,
            maxLength: 500,
        },

    },
    required: [
        "firstName",
        "lastName",
        "email",
        "title",
        "message"
          
    ],
    additionalProperties: false,
});

export { SendMessageValidator };