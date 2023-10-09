import IModel from '../../common/IModel.interface';
import PhotoModel from '../photo/PhotoModel.model';
import CategoryModel from '../category/CategoryModel.model';

class NewsModel implements IModel{
    newsId: number;
    title: string;
    content: string;
    altText: string | null;
    isDeleted: boolean;
    createdAt: string;
    modifiedAt: string;
    categoryId: number;

    category?: CategoryModel;
    photos?: PhotoModel[] = [];
      
}

export default NewsModel;