import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();



 export default interface IEditNewsDto {
    title?: string;
    content?: string;
    altText?: string;
    
    
}


export interface IEditNews extends IServiceData {
    
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
            minLength: 5,
            maxLength: 500,
        },
     
        altText: {
            type: "string",
            maxLength: 128,
            pattern: "^(#([a-z]{5,128})(#[a-z]{5,128})*)?$",
        },

    },
    required: [  
    ],
    additionalProperties: false,
});

export { EditNewsValidator };