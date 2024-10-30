import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

enum CategoryType {
    Products = "products",
    News = "news",
    Root = "root"
}
export default interface IAddCategoryDto {
    name: string;
    categoryType: CategoryType;
    parentCategoryId: number;
    
    
}

export interface IAddCategory extends IServiceData {
    category_type: CategoryType;
}

const AddCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 64,
        },

        categoryType: {
            type: "string",
            enum: ["product", "news", "root"]
        },
        parentCategoryId: {
            type: "number"
        }
    },
    required: [
        "name",
        "categoryType",
        "parentCategoryId"
    
    ],
    additionalProperties: false,
});


export { AddCategoryValidator };