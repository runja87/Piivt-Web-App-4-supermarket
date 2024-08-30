import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();
enum Percentage {
    TenPercent = 0.1,
    TwentyPercent = 0.2,
    ThirtyPercent = 0.3,
    FortyPercent = 0.4,
    FiftyPercent = 0.5,
    SixtyPercent = 0.6,
    SeventyPercent = 0.7,
    EightyPercent = 0.8,
    NinetyPercent = 0.9,

}

export interface IEditProductDto {
    name?: string;
    description?: string;
    altText?: string;
    price?: number;
    sku?: number;
    supply?: number;
    discount?: Percentage;
    isOnDiscount?: number;
}


export default interface IEditProduct extends IServiceData {
    name?: string;
    description?: string;
    alt_text?: string;
    price?: number;
    sku?: number;
    supply?: number;
    discount?: Percentage;
    is_on_discount?: number;
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
            pattern: "^#[a-z]{5,}$",
        },
        price:
        {
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,
        },
        sku:
        {
            type: 'integer',
            minimum: 100000000000,  
            maximum: 999999999999 
            
        },
        supply:
        {
            type: "number",
        },
        isDeleted:
        {
            type: "boolean",
        }

    },
    required: [
       
    ],

    additionalProperties: false,
});

export { EditProductValidator };