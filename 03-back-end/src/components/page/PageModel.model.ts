import IModel from '../../common/IModel.interface';
import PhotoModel from '../photo/PhotoModel.model';




class PageModel implements IModel {
    pageId?: number;
    title?: string;
    altText?: string;
    content?: string;
    createdAt?: string;
    modifiedAt?: string;
    isDeleted?: boolean;
    
    
    photos?: PhotoModel[] = [];

}

export default PageModel;