import IModel from '../../common/IModel.interface';
import NewsModel from '../news/NewsModel.model';
import PageModel from '../page/PageModel.model';
import ProductModel from '../product/ProductModel.model';



class PhotoModel implements IModel {
    photoId?: number;
    name?: string;
    altText?: string;
    isDeleted?: boolean;
    filePath?: string;
    newsId?: number;
    pageId?: number;
    productId?: number;
}

export default PhotoModel;