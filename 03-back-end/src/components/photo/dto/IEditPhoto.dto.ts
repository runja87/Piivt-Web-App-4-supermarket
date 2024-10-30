import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export default interface IEditPhotoDto {

    altText?: string;
}

export interface IEditPhoto extends IServiceData {
    name: string;
    file_path: string;
  
}


const EditPhotoValidator = ajv.compile({
    type: "object",
    properties: {
        altText: {
            type: "string",
            maxLength: 128,
            default: null,
            pattern: "^#([a-z]{5,128})(#[a-z]{5,128})*$",
          },

    },
    required: [
     "altText"
    ],

    additionalProperties: false,
});

export { EditPhotoValidator };