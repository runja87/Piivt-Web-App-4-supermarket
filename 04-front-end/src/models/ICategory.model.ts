import INews from "./INews.model";
import IProduct from "./IProduct.model";

enum CategoryType {
    RootCategories = "root",
    Products = "product",
    News = "news"
  }
export default interface ICategory {
    //map(arg0: (category: ICategory) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    categoryId: number;
    name: string;
    parentCategoryId: number;
    categoryType: CategoryType;
    news?: INews[];
    products?: IProduct[];
    isDeleted: boolean;
    threeLevelStructure: ICategory[];

  
    
   
   
}