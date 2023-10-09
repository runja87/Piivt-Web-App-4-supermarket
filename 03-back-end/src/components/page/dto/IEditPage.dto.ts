import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export interface IEditPageDto {

    title: string;
    content: string;
    altText?: string;
    isDeleted?: boolean;
    
   

}

export default interface IEditPage extends IServiceData {
    title: string;
    content: string;
    alt_text?: string;
    is_deleted?: number;
    
}


const EditPageValidator = ajv.compile({
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
          isDeleted:
          {
            type: "boolean",
           
          },

    },
    required: [
        "title",
        "content", 
    ],

    additionalProperties: false,
});

export { EditPageValidator };