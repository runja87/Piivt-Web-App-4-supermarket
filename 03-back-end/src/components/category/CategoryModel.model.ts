import NewsModel from '../news/NewsModel.model';
import IModel from '../../common/IModel.interface';
import ProductModel from '../product/ProductModel.model';
enum CategoryType {
  RootCategories = "root",
  Products = "product",
  News = "news"
}
class CategoryModel implements IModel {
    categoryId: number;
    name: string;
    categoryType: CategoryType;
    isDeleted: boolean;
    parentCategoryId: number;
    
    threeLevelStructure?: CategoryModel[] = [];
    news?: NewsModel[] = [];
    products?: ProductModel[] = [];
  
}

export default CategoryModel;
