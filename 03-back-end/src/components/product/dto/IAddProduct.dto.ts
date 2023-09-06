import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export interface IAddProductDto {

    name: string;
    description: string;
    altText?: string | null;
    price: number;
    sku: number;
    supply: number;
   

}

export default interface IAddProduct extends IServiceData {
    name: string;
    description: string;
    alt_text?: string | null;
    price: number;
    sku: number;
    supply: number;
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
            type: 'integer',
            minimum: 100000000000,  
            maximum: 999999999999 
           
        },
        supply: {
            type: "number",

        },

        altText: {
            type: "string",
            maxLength: 128,
            default: null,
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