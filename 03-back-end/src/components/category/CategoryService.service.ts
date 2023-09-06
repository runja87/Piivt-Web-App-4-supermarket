import CategoryModel from "./CategoryModel.model";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
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
        category.parentCategoryId = +data?.parent_id;
        

        if (options.loadNews) {
            category.news = await this.services.news.getAllByCategoryId(category.categoryId, options);
        }
        if (options.loadProducts) {
            category.products = await this.services.product.getAllByCategoryId(category.categoryId, options);
        }

        return category;
    }

    public async add(data: IAddCategory, options: ICategoryAdapterOptions): Promise<CategoryModel> {
        return this.baseAdd(data, options);
    }

    public async editById(categoryId: number, data: IEditCategory, options: ICategoryAdapterOptions = DefaultCategoryAdapterOptions): Promise<CategoryModel> {
        return this.baseEditById(categoryId, data, options);
    }
    public async deleteById(categoryId: number): Promise<boolean> {
        return this.baseDeleteById(categoryId);
    }

async getThreeLevelDepth(options: ICategoryAdapterOptions) {
    const allCategories = await this.getAll(options);
  
    
    const rootCategory = allCategories.find(cat => cat.name === 'root');
  
    if (!rootCategory) {
      throw new Error("Root category not found!");
    }
  

    const hierarchy = await this.buildHierarchy(allCategories, rootCategory.categoryId, 3);
  
    return hierarchy;
  }
  
  private async buildHierarchy(allCategories: CategoryModel[], parentCategoryId: number, depth: number): Promise<CategoryModel[]> {
    if (depth === 0) {
      return [];
    }
  
    const childrenOfRoot = allCategories.filter(cat => cat.parentCategoryId === parentCategoryId && cat.categoryId !== parentCategoryId);  // Exclude the parent itself
  
    for (let child of childrenOfRoot) {
      child.children = await this.buildHierarchy(allCategories, child.categoryId, depth - 1);
    }
  
    return childrenOfRoot;
  }


  


}

export default CategoryService;

export { DefaultCategoryAdapterOptions };