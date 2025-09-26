import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();



export default interface IAddNewsDto {
    title: string;
    content: string;
    altText?: string;
    
}


export interface IAddNews extends IServiceData {
    category_id: number;
}


const AddNewsValidator = ajv.compile({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 4,
            maxLength: 128,
        },
        content: {
            type: "string",
            minLength: 50,
            maxLength: 500,
        },
     
        altText: {
            type: "string",
            maxLength: 128,
            default: null,
            pattern: "^(#([a-z]{5,128})(#[a-z]{5,128})*)?$",
        },

    },
    required: [
        "title",
        "content",
    ],
    additionalProperties: false,
});

export { AddNewsValidator };