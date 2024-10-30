import INews from "./INews.model";
import IProduct from "./IProduct.model";

enum CategoryType {
  RootCategories = "root",
  Products = "product",
  News = "news"
}
export default interface ICategory {
  categoryId: number;
  name: string;
  categoryType: CategoryType;
  parentCategoryId: number | null;
  isDeleted: boolean;
  threeLevelStructure: ICategory[];
  news?: INews[];
  products?: IProduct[];
}