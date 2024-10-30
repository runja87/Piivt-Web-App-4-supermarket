import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();

export interface ISearchProductDto {
    search?: string;
    category?: string;
    minPrice?: string; 
    maxPrice?: string;
}


const SearchProductValidator = ajv.compile({
    type: "object",
    properties: {
        search: {
            type: "string",
           
           
        },
        category: {
            type: "string",
           
        },
        minPrice: {
            type: "string",
           
        },
        maxPrice: {
            type: "string",
     
        },


    },
    required: [
       
    ],

    additionalProperties: false,
});

export { SearchProductValidator };