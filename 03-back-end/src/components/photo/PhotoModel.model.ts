import IModel from '../../common/IModel.interface';



class PhotoModel implements IModel {
    photoId: number;
    name: string;
    altText?: string|null;
    isDeleted: boolean;
    filePath: string;
    newsId: number|null;
    pageId: number|null;
    productId: number|null;
}

export default PhotoModel;