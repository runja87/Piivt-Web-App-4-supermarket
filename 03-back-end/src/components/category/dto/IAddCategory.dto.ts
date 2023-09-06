import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

enum CategoryType {
    Products = "products",
    News = "news"
}
export interface IAddCategoryDto {
    name: string;
    categoryType: CategoryType;
    parentCategoryId: string;   // samo za testiranje api ja. stiyace preko servisnog DTO-a
    
}

export default interface IAddCategory extends IServiceData {
    name: string;
    category_type: CategoryType;
    parent_id: number;

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
            enum: ["product", "news"],
        },
    },
    required: [
        "name",
        "categoryType",
    
    ],
    additionalProperties: true, // default false
});


export { AddCategoryValidator };