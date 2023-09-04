import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();



export interface IEditProductDto {
    name: string;
    description: string;
    altText?: string | null;
    price: number;
    sku: number;
    supply: number;
    discount?: number;
    isOnDiscount?: number | null;
}


export default interface IEditProduct extends IServiceData {
    name: string;
    description: string;
    alt_text?: string | null;
    price: number;
    sku: number;
    supply: number;
    discount?: number | null;
    is_on_discount?: number | 0;
    category_id: number;

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
            minLength: 50,
            maxLength: 500,
        },
        discount:
        {
            type: "number",
            default: null,

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
            default: null,
        },
        price:
        {
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,
        },
        sku:
        {
            type: "number",
            minimum: 12,
            maximum: 12,
        },
        supply:
        {
            type: "number",
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

export { EditProductValidator };