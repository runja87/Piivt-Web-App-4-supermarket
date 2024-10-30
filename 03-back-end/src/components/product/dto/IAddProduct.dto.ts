import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export default interface IAddProductDto {

    name: string;
    description: string;
    altText?: string;
    price: number;
    sku: number;
    supply: number;
   

}

export interface IAddProduct extends IServiceData {
    category_id: number;
    
}


const AddProductValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 64,
        },
        description: {
            type: "string",
            minLength: 50,
            maxLength: 500,
        },
        price: {
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,

        },
        sku: {
            type: 'number',
            minimum: 1000000000,
            maximum: 9999999999,
        },
        supply: {
            type: "number",

        },

        altText: {
            type: "string",
            maxLength: 128,
            default: null,
            pattern: "^(#([a-z]{5,128})(#[a-z]{5,128})*)?$",
          },

    },
    required: [
        "name",
        "description",
        "price",
        "sku",
        "supply",
        
    ],

    additionalProperties: false,
});

export { AddProductValidator };