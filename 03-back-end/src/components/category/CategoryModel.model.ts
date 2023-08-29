import NewsModel from '../news/NewsModel.model';
import IModel from '../../common/IModel.interface';
enum CategoryType {
  RootCategories = "root",
  Products = "products",
  News = "news"
}
class CategoryModel implements IModel {
    categoryId: number;
    name: string;
    categoryType: CategoryType;
    isDeleted: boolean;
  //  imagePath: string;
    parentCategoryId: number;
    
    parentCategoryes: CategoryModel[] = [];
    //subcategories: CategoryModel[] = [];

    news?: NewsModel[];
    //product?: ProductMOdel[];
}

export default CategoryModel;
