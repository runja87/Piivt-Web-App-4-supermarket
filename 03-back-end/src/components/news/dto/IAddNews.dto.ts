import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();



export  interface IAddNewsDto {
    title: string;
    content: string;
    altText: string;
    categoryId: number;
}


export default interface IAddNews extends IServiceData {
    title: string;
    content: string;
    alt_text: string;
    category_id: number;
}


const AddNewsValidator = ajv.compile({
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

export { AddNewsValidator };