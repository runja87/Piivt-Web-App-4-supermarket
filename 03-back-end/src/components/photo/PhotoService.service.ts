import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import PhotoModel from "./PhotoModel.model";
import IAddPhoto from "./dto/IAddPhoto.dto";


class IPhotoAdapterOptions implements IAdapterOptions { }

class PhotoService extends BaseService<PhotoModel, IPhotoAdapterOptions> {
    tableName(): string {
        return "photo";
    }

    protected async adaptToModel(data: any, options: IPhotoAdapterOptions): Promise<PhotoModel> {
        const photo: PhotoModel = new PhotoModel();
        photo.photoId = +data?.photo_id;
        photo.name = data?.name;
        photo.altText = data?.alt_text;
        photo.isDeleted = data?.is_deleted;
        photo.filePath = data?.file_path;
        photo.newsId = data?.news_id;
        photo.pageId = data?.page_id;
        photo.productId = data?.product_id;  
        return photo;
    }

    public async getAllByProductId(productId: number, options: IPhotoAdapterOptions = {}): Promise<PhotoModel[] | null> {
        return this.baseGetAllByFieldNameAndValue('product_id',productId, options);
    }
    public async getAllByNewsId(newsId: number, options: IPhotoAdapterOptions = {}): Promise<PhotoModel[] | null> {
        return this.baseGetAllByFieldNameAndValue('news_id', newsId, options);
    }
    public async getAllByPageId(pageId: number, options: IPhotoAdapterOptions = {}): Promise<PhotoModel[] | null> {
        return this.baseGetAllByFieldNameAndValue('page_id', pageId, options);
    }
 

    public async add(data: IAddPhoto, options: IPhotoAdapterOptions = {}): Promise<PhotoModel> {
        return this.baseAdd(data, {});
    }

    public async editById(photoId: number, data: IPhotoAdapterOptions): Promise<PhotoModel> {
        return this.baseEditById(photoId, data, {});
    }

    public async deleteById(photoId: number): Promise<boolean> {
        return this.baseDeleteById(photoId);
    }
    
}

export default PhotoService;