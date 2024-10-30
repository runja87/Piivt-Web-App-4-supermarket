import ICategory from "./ICategory.model";
import IPhotoModel from "./IPhoto.model";

export default interface IProduct {

    category: ICategory;
    productId: number;
    name: string;
    altText?: string;
    description: string;
    price: number;
    sku: number;
    supply: number;
    isOnDiscount: number;
    discount: string;
    createdAt: string;
    modifiedAt: string;
    isDeleted: boolean;
    categoryId: number;
    photos: IPhotoModel[];
    
}

