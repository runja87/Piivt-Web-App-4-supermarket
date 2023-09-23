import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import IServiceData from "../../common/IServiceData.interface";
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
        photo.filePath = data?.file_path;  
        return photo;
    }

    public async getAllByCategoryId(photoId: number, options: IPhotoAdapterOptions): Promise<PhotoModel[] | null> {
        return this.getAllByFieldNameAndValue('photo_id', photoId, options);
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