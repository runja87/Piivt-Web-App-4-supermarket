import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import { basename } from "path";
import IEditPhotoDto, { EditPhotoValidator } from "./dto/IEditPhoto.dto";

class PhotoController extends BaseController {

    async getAllPhotos(req: Request, res: Response) {
      this.services.photo.getAll({})
      .then(result => {
        if (result.length === 0) {
          return res.status(404).send('No photos uploaded!');
        }
        else {
          return res.send(result);
        }

      })
       
    }
    
      async editPhoto(req: Request, res: Response) {
        const photoId: number = +req.params?.pid;
        const data: IEditPhotoDto = req.body;
        if (!EditPhotoValidator(data)) {
          return res.status(400).send(EditPhotoValidator.errors);
        }
        this.services.photo.getById(photoId, {})
          .then(result => {
            if (result === null || result.isDeleted) {
              return res.status(404).send('Photo not found or deleted!');
            }
    
                this.services.photo.editById(photoId, {name: (data as any).name, alt_text: (data as any).altText, is_deleted: (data as any).isDeleted})
                  .then(result => {
                    return res.send(result);
                  })
                  .catch(error => {
                    return res.status(500).send(error?.message);
                  });
              })
      }

      async uploadPhoto(req: Request, res: Response) {
                const uploadedFiles =  await this.doFileUpload(req, res);
    
                if (uploadedFiles === null) {
                  return;
                }
                const photos = [];
                for (let singleFile of uploadedFiles) {
                  const fileName = basename(singleFile);
                  if(fileName.length > 64){
                    return res.status(400).send(`Photo ${fileName} must be no longer than 24 characters including spaces!`);
                  }
                  const photo = await this.services.photo.add({ name: fileName, file_path: singleFile }, {});
    
                  if (photo === null) {
                    return res.status(500).send("Failed to add this photo into the database!");
                  }
                  photos.push(photo);
                }
    
               return res.send(photos);
      }
    
    
      async deletePhoto(req: Request, res: Response) {
        const photoId: number = +req.params?.pid;
        this.services.photo.getById(photoId, {loadPhotos: false})
          .then(async result => {
            if (result === null) {
              return res.status(404).send('Photo not found or it is already marked as deleted!');
            }
            if(result.newsId !== null || result.pageId !== null || result.productId !== null){
              return res.status(400).send('Photo could not be deleted!');
            }
      
            this.services.photo.deleteById(photoId)
              .then(result => {
                return res.send('This photo has been deleted!');
              })
              .catch(error => {
                return res.status(500).send(error?.message);
              })
    
          })
          .catch(error => {
            return res.status(500).send(error?.message);
          });
      }

    

}
export default PhotoController;