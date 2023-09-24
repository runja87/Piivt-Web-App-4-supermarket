import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import ProductModel from "./ProductModel.model";
import IAddProduct from "./dto/IAddProduct.dto";
import IEditProduct from "./dto/IEditProduct.dto";






class IProductAdapterOptions implements IAdapterOptions { }

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
        return product;
    }

    public async getAllByCategoryId(categoryId: number, options: IProductAdapterOptions): Promise<ProductModel[] | null> {
        return this.getAllByFieldNameAndValue('category_id', categoryId, options);
    }
 

    public async add(data: IAddProduct): Promise<ProductModel> {
        return this.baseAdd(data, {});
    }

    public async editById(productId: number, data: IEditProduct): Promise<ProductModel> {
        return this.baseEditById(productId, data, {});
    }

    public async deleteById(productId: number): Promise<boolean> {
        return this.baseDeleteById(productId);
    }
}

export default ProductService;