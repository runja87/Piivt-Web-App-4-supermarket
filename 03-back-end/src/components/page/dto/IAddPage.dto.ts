import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export interface IAddPageDto {

    title: string;
    content: string;
    altText?: string;
    
   

}

export default interface IAddPage extends IServiceData {
    title: string;
    content: string;
    alt_text?: string;
    
}


const AddPageValidator = ajv.compile({
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
            maxLength: 2000,
        },
        altText: {
            type: "string",
            maxLength: 128,
            
          },

    },
    required: [
        "title",
        "content",
       
        
    ],

    additionalProperties: false,
});

export { AddPageValidator };