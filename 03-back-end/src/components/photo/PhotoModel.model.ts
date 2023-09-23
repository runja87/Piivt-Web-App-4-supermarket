import IModel from '../../common/IModel.interface';



class PhotoModel implements IModel {
    photoId: number;
    name: string;
    altText?: string;
    filePath: string;
}

export default PhotoModel;