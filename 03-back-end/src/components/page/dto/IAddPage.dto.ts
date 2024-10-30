import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export default interface IAddPageDto {

    title: string;
    content: string;
    altText?: string;
    
   

}

export interface IAddPage extends IServiceData {
    
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
            pattern: "^(#([a-z]{5,128})(#[a-z]{5,128})*)?$",
            
          },

    },
    required: [
        "title",
        "content",
       
        
    ],

    additionalProperties: false,
});

export { AddPageValidator };