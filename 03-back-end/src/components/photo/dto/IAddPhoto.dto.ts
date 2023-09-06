import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();


export  interface IAddPhotoDto {
    altText?: string | null;
  
}


export default interface IAddPhoto extends IServiceData {
    name: string;
    image_path: string;
    product_id: number;
    news_id: number;
    page_id: number;
}


const AddPhotoValidator = ajv.compile({
    type: "object",
    properties: {

        altText: {
            type: "string",
            maxLength: 64,
            default: null,
        },

    },
    required: [
              
    ],
    additionalProperties: false,
});

export { AddPhotoValidator };