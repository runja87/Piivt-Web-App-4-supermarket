import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();



 export interface IEditNewsDto {
    title?: string;
    content?: string;
    altText?: string;
    isDeleted?: boolean;
    
}


export default interface IEditNews extends IServiceData {
    title?: string;
    content?: string;
    alt_text?: string | null;
    is_deleted?: number; 
}

const EditNewsValidator = ajv.compile({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 4,
            maxLength: 64,
        },
        content: {
            type: "string",
            minLength: 50,
            maxLength: 500,
        },
     
        altText: {
            type: "string",
            maxLength: 128,
            pattern: "^#([a-z]{5,})(?=(#|$))|^$",
        },

    },
    required: [  
    ],
    additionalProperties: true,
});

export { EditNewsValidator };