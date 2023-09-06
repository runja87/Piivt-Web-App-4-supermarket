import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

enum CategoryType {
    Products = "products",
    News = "news"
}
export interface IEditCategoryDto {
    name: string;
    categoryType: CategoryType;
    parentCategoryId: string; // samo za testiranje api ja. stiyace preko servisnog DTO-a
    isDeleted: boolean; 
    
}

export default interface IEditCategory extends IServiceData {
    name: string;
    category_type: CategoryType;
    is_deleted: boolean;
    //parent_id: number;

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
            enum: ["product", "news"],
        },
        isDeleted: {
 
            type: "boolean",
            
            
        }
       
    },
    required: [
        "name",
        "categoryType",
    ],
    additionalProperties: true,  // default false
});


export { EditCategoryValidator };