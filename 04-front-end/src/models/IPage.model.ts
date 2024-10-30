import IPhotoModel from "./IPhoto.model";
export default interface IPage {
    pageId: number;
    title: string;
    altText?: string;
    content: string;
    createdAt: string;
    modifiedAt: string;
    
    
    photos: IPhotoModel[];
}