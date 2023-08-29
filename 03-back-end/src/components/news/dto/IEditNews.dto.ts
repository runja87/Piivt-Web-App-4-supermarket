import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();



 export interface IEditNewsDto {
    title: string;
    content: string;
    altText: string;
    //parentCategoryId: string;
}


export default interface IEditNews extends IServiceData {
    title: string;
    content: string;
    alt_text: string;
    category_id: number; 
}

const EditNewsValidator = ajv.compile({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 4,
            maxLength: 32
        },
        content: {
            type: "string",
        },
     
        altText: {
            type: "string",
            maxLength: 64
        },

    },
    required: [
        "title",
        "content",  
    ],
    additionalProperties: true,
});

export { EditNewsValidator };