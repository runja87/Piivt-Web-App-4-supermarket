import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export interface IEditPhotoDto {

    name?: string;
    altText: string;
    
}

export default interface IEditPhoto extends IServiceData {
    name?: string;
    alt_text: string;
    is_deleted?: number;
    
}


const EditPhotoValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 64,
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
        "altText",
    ],

    additionalProperties: false,
});

export { EditPhotoValidator };