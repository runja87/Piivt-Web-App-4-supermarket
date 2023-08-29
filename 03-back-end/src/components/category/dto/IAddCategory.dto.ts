import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

enum CategoryType {
    RootCategories = "root",
    Products = "products",
    News = "news"
}
export interface IAddCategoryDto {
    name: string;
    categoryType: CategoryType;
    parentCategoryId: number;

}

export default interface IAddCategory extends IServiceData {
    name: string;
    category_type: CategoryType;
    category__id: number;

}

const AddCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 32,
        },

        categoryType: {
            type: "string",
            enum: ["product", "news", "root"],
        },
        parentCategoryId: {
            type: "number",
            minimum: 1,
        }

    },
    required: [
        "name",
        "category_type",
        "parentCategoryId"
    ],
    additionalProperties: false,
});


export { AddCategoryValidator };