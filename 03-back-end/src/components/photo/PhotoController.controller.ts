import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import { basename } from "path";
import IEditPhotoDto, { EditPhotoValidator, IEditPhoto } from "./dto/IEditPhoto.dto";
import PhotoModel from "./PhotoModel.model";
import IAddPhoto from "./dto/IAddPhoto.dto";


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
      try {
        const photoId: number = +req.params?.pid;
        const data: IEditPhotoDto = req.body;
    
        const existingPhoto = await this.services.photo.getById(photoId, {});
        if (!existingPhoto || existingPhoto.isDeleted) {
          return res.status(404).send('Photo not found or deleted!');
        }
        if (req.files && req.files.name) {
          const uploadedFiles = await this.doFileUpload(req, res);
          let photo = null;
          let photos: PhotoModel[] = [];
          for (let singleFile of uploadedFiles) {
            const fileName = basename(singleFile);    
            if (fileName.length > 64) {
              return res.status(400).send(`Photo ${fileName} must be no longer than 64 characters including spaces!`);
            }
            let data: IEditPhoto = {name: fileName, file_path: singleFile};
            photo = await this.services.photo.editById(photoId, data);
           
            if (!photo) {
              return res.status(500).send("Failed to replace the photo in the database!");
            }
            photos.push(photo);
            
          }
          return res.send(photos);
      
        } else {
          if (!EditPhotoValidator(data)) {
            return res.status(400).send(EditPhotoValidator.errors);
          }
          await this.services.photo.editById(photoId, { alt_text: data?.altText });
          return res.send({ message: 'Photo altText updated successfully' });
        }
      } catch (error) {
        return res.status(500).send(error?.message || 'An unexpected error occurred.');
      }
    }
    
    

async uploadPhoto(req: Request, res: Response) {
  try {
    const uploadedFiles = await this.doFileUpload(req, res);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).send('No files uploaded.');
    }

    const photos: PhotoModel[] = [];
    let photo;
    for (let singleFile of uploadedFiles) {
      const fileName = basename(singleFile);

      if (fileName.length > 64) {
        return res.status(400).send(`Photo ${fileName} must be no longer than 64 characters including spaces!`);
      }
      let data: IAddPhoto = {name: fileName, file_path: singleFile};
        photo = await this.services.photo.add(data,{});
     

      if (!photo) {
        return res.status(500).send("Failed to add the photo in the database!");
      }
      photos.push(photo);
    }

    return res.send(photos);
  } catch (error) {
    console.error("Error in uploadPhoto:", error);
    return res.status(500).send(error?.message || 'An unexpected error occurred.');
  }
}

      
    
    
      async deletePhoto(req: Request, res: Response) {
        const photoId: number = +req.params?.pid;
        this.services.photo.getById(photoId, {loadPhotos: false})
          .then(async result => {
            if (result === null) {
              return res.status(404).send('Photo not found or it is already marked as deleted!');
            }
      
            this.services.photo.deleteById(photoId)
              .then(() => {
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