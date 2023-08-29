import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

enum CategoryType {
    RootCategories = "root",
    Products = "products",
    News = "news"
}
export interface IEditCategoryDto {
    name: string;
    categoryType: CategoryType;
    parentCategoryId: number;

}

export default interface IEditCategory extends IServiceData {
    name: string;
    category_type: CategoryType;
    category__id: number;

}

const EditCategoryValidator = ajv.compile({
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
        "categoryType",
        "parentCategoryId"
    ],
    additionalProperties: false,
});


export { EditCategoryValidator };