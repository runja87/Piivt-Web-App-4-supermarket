import ICategory from "./ICategory.model";
import IPhotoModel from "./IPhoto.model";

export default interface INews {
    category: ICategory;
    newsId: number;
    title: string;
    content: string;
    altText?: string;
    isDeleted: boolean;
    createdAt: string;
    modifiedAt: string;
    categoryId: number;
    photos: IPhotoModel[];
}
