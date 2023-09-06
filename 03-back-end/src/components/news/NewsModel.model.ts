import IModel from '../../common/IModel.interface';
import PhotoModel from '../photo/PhotoModel.model';

class NewsModel implements IModel{
    newsId: number;
    title: string;
    content: string;
    altText: string;
    isDeleted: boolean;
    createdAt: string;
    modifiedAt: string;
    categoryId: number;

    photos?: PhotoModel[] = [];
}

export default NewsModel;