import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import ProductModel from "./ProductModel.model";
import IAddProduct from "./dto/IAddProduct.dto";
import IEditProduct from "./dto/IEditProduct.dto";
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
import * as mysql2 from 'mysql2/promise';







interface IProductAdapterOptions extends IAdapterOptions {
    loadPhotos: boolean;
    loadCategory: boolean;

}
const DefaultProductAdapterOptions: IProductAdapterOptions = {
    loadPhotos: false,
    loadCategory: false,

}

class ProductService extends BaseService<ProductModel, IProductAdapterOptions> {
    tableName(): string {
        return "product";
    }

    protected async adaptToModel(data: any, options: IProductAdapterOptions): Promise<ProductModel> {
        const product: ProductModel = new ProductModel();
        product.productId = +data?.product_id;
        product.name = data?.name;
        product.description = data?.description;
        product.price = +data?.price;
        product.sku = +data?.sku;
        product.supply = +data?.supply;
        product.altText = data?.alt_text;
        product.isDeleted = Boolean(data?.is_deleted);
        product.discount = data.discount;
        product.isOnDiscount = +data?.is_on_discount;
        product.createdAt = data?.created_at;
        product.modifiedAt = data?.modified_at;
        product.categoryId = +data?.category_id;



        if(options.loadCategory){
            product.category = await this.services.category.getById(product.categoryId, DefaultCategoryAdapterOptions);
            
        }
        if(options.loadPhotos){
            product.photos = await this.services.photo.getAllByProductId(product.productId);
        }

        return product;
    }

    public async getAllByCategoryId(categoryId: number, options: IProductAdapterOptions): Promise<ProductModel[] | null> {
        return this.baseGetAllByFieldNameAndValue('category_id', categoryId, options);
    }

    public async getRelated(categoryId: any, fieldData: string, options: IProductAdapterOptions):Promise<ProductModel[]> {
        return this.baseGetRelated(categoryId, fieldData, options);
      }
 

    public async add(data: IAddProduct, options: IProductAdapterOptions): Promise<ProductModel> {
        return this.baseAdd(data, options);
    }

    public async editById(productId: number, data: IEditProduct, options: IProductAdapterOptions): Promise<ProductModel> {
        return this.baseEditById(productId, data, options);
    }

    public async deleteById(productId: number): Promise<boolean> {
        return this.baseDeleteById(productId);
    }

    public async getBySearchParams(searchQuery: any, options: IProductAdapterOptions): Promise<ProductModel[]> {
      const { search, category, minPrice, maxPrice } = searchQuery;
      const queryParams: any[] = [];
      
      let sql = `SELECT * FROM product WHERE (is_deleted IS NULL OR is_deleted = 0)`;
    
      if (search) {
        sql += ` AND (name LIKE ? OR alt_text LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`);
      }
      
      if (category) {
        
        const subcategoryIds = await this.getSubcategoryIds(category);
        subcategoryIds.push(category); 
    
        sql += ` AND category_id IN (${subcategoryIds.map(() => '?').join(', ')})`;
        queryParams.push(...subcategoryIds);
      }
    
      if (minPrice) {
        sql += ` AND price >= ?`;
        queryParams.push(minPrice);
      }
    
      if (maxPrice) {
        sql += ` AND price <= ?`;
        queryParams.push(maxPrice);
      }
    
      const [rows]: any = await this.db.execute(sql, queryParams);
      if (rows === undefined) {
        return [];
    } 
      const products: ProductModel[] = [];
        for (const row of rows as mysql2.RowDataPacket[]) {
        products.push(await this.adaptToModel(row, options));
                    }
      return products;
    
     
    }

    private async getSubcategoryIds(parentCategoryId: number): Promise<number[]> {
      const sql = `SELECT category_id FROM category WHERE parent_id = ?`;
      const [rows]: any = await this.db.execute(sql, [parentCategoryId]);
    
      const subcategoryIds: number[] = rows.map((row: any) => row.categoryId);
    
      for (const subcategoryId of subcategoryIds) {
        const nestedSubcategoryIds = await this.getSubcategoryIds(subcategoryId);
        subcategoryIds.push(...nestedSubcategoryIds);
      }
    
      return subcategoryIds;
    }
    
}

export default ProductService;
export { DefaultProductAdapterOptions };