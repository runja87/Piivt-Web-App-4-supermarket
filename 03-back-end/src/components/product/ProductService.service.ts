import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import ProductModel from "./ProductModel.model";
import IAddProduct from "./dto/IAddProduct.dto";
import IEditProduct from "./dto/IEditProduct.dto";
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";







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
        product.isOnDiscount = Boolean(data?.is_on_discount);
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
 

    public async add(data: IAddProduct, options: IProductAdapterOptions): Promise<ProductModel> {
        return this.baseAdd(data, options);
    }

    public async editById(productId: number, data: IEditProduct, options: IProductAdapterOptions): Promise<ProductModel> {
        return this.baseEditById(productId, data, options);
    }

    public async deleteById(productId: number): Promise<boolean> {
        return this.baseDeleteById(productId);
    }
}

export default ProductService;
export { DefaultProductAdapterOptions };