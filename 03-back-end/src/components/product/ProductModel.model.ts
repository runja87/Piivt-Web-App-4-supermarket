import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/CategoryModel.model';
import PhotoModel from '../photo/PhotoModel.model';


class ProductModel implements IModel {
    productId?: number;
    name?: string;
    altText?: string;
    description?: string;
    price?: number;
    sku?: number;
    supply?: number;
    isOnDiscount?: number;
    discount?: string;
    createdAt?: string;
    modifiedAt?: string;
    isDeleted?: boolean;
    categoryId?: number;
    
    photos?: PhotoModel[] = [];
    category?: CategoryModel;

}

export default ProductModel;