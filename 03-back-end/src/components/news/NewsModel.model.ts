import IModel from '../../common/IModel.interface';

class NewsModel implements IModel{
    newsId: number;
    title: string;
    content: string;
    altText: string;
    isDeleted: boolean;
    createdAt: string;
    modifiedAt: string;
    categoryId: number;
}

export default NewsModel;