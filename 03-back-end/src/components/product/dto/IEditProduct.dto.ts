import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export default interface IEditProductDto {
    name?: string;
    description?: string;
    altText?: string;
    price?: number;
    sku?: number;
    supply?: number;
    discount?: string;
    isOnDiscount?: number;
}


export interface IEditProduct extends IServiceData {
   

}


const EditProductValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 64,
        },
            description: {
            type: "string",
            minLength: 5,
            maxLength: 500,
        },
        discount:
        {
             type: "string",
             
        },
        isOnDiscount:
        {
            type: "number",
            default: 0,

        },
        altText:
        {
            type: "string",
            maxLength: 128,
            pattern: "^(#([a-z]{5,128})(#[a-z]{5,128})*)?$",

        },
        price:
        {
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,
        },
        sku:
        {
            type: 'number',
            minimum: 1000000000,
            maximum: 9999999999,
            
        },
        supply:
        {
            type: "number",
        },
     

    },
    required: [   
    ],

    additionalProperties: false,
});

export { EditProductValidator };