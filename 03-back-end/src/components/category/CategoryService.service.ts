import CategoryModel from "./CategoryModel.model";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import NewsService from '../news/NewsService.service';
import BaseService from "../../common/BaseService";
import IAddCategory from "./dto/IAddCategory.dto";
import IEditCategory from "./dto/IEditCategory.dto";






interface ICategoryAdapterOptions extends IAdapterOptions {
    loadNews: boolean;
    loadProducts: boolean;

}
const DefaultCategoryAdapterOptions: ICategoryAdapterOptions = {
    loadNews: false,
    loadProducts: false,

}

class CategoryService extends BaseService<CategoryModel, ICategoryAdapterOptions>{
    tableName(): string {
        return "category";
    }

    protected async adaptToModel(data: any, options: ICategoryAdapterOptions = DefaultCategoryAdapterOptions): Promise<CategoryModel> {
        const category: CategoryModel = new CategoryModel();
        category.categoryId= +data?.category_id;
        category.name = data?.name;
        category.categoryType = data?.category_type;
        category.isDeleted = Boolean(data?.is_deleted);
        category.parentCategoryId = +data?.category__id;


        if (options.loadNews) {
            const newsService: NewsService = new NewsService(this.db);
           // const categoryService: CategoryService = new CategoryService(this.db);

            //category.parentCategoryes = await categoryService.getAllByFieldNameAndValue('category_id', category.parentCategoryId, options);
            category.news = await newsService.getAllByCategoryId(category.categoryId, options);

        }

        return category;
    }

    public async add(data: IAddCategory, options: ICategoryAdapterOptions): Promise<CategoryModel> {
        return this.baseAdd(data, options);
    }

    public async editById(categoryId: number, data: IEditCategory, options: ICategoryAdapterOptions = DefaultCategoryAdapterOptions): Promise<CategoryModel> {
        return this.baseEditById(categoryId, data, options);
    }


}



export default CategoryService;

export { DefaultCategoryAdapterOptions };