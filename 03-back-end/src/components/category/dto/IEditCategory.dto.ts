import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

enum CategoryType {
    Products = "products",
    News = "news",
    RootCategories = "root"
}
export default interface IEditCategoryDto {
    name?: string;
    categoryType?: CategoryType;
}

export interface IEditCategory extends IServiceData {

}

const EditCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 64,
        },

        categoryType: {
            type: "string",
            enum: ["product", "news","root"],
        },
       
    },
    required: [
        "name",
    ],
    additionalProperties: false,
});


export { EditCategoryValidator };