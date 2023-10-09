import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/CategoryModel.model';
import PhotoModel from '../photo/PhotoModel.model';


enum Percentage {
    TenPercent = 0.1,
    TwentyPercent = 0.2,
    ThirtyPercent = 0.3,
    FortyPercent = 0.4,
    FiftyPercent = 0.5,
    SixtyPercent = 0.6,
    SeventyPercent = 0.7,
    EightyPercent = 0.8,
    NinetyPercent = 0.9,

}

class ProductModel implements IModel {
    productId: number;
    name: string;
    altText: string | null;
    description: string;
    price: number;
    sku: number;
    supply: number;
    isOnDiscount: boolean;
    discount: Percentage | null;
    createdAt: string;
    modifiedAt: string;
    isDeleted: boolean;
    categoryId: number;
    
    photos?: PhotoModel[] = [];
    category?: CategoryModel;

}

export default ProductModel;