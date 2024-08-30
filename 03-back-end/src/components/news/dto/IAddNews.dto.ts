import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();



export  interface IAddNewsDto {
    title: string;
    content: string;
    altText?: string;
    
}


export default interface IAddNews extends IServiceData {
    title: string;
    content: string;
    alt_text?: string | null;
    category_id: number;
}


const AddNewsValidator = ajv.compile({
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
        "title",
        "content",
    ],
    additionalProperties: true,
});

export { AddNewsValidator };