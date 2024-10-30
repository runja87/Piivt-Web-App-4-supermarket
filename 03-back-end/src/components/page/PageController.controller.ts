import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import IAddPageDto, { AddPageValidator } from "./dto/IAddPage.dto";
import { DefaultPageAdapterOptions } from "../page/PageService.service";
import IEditPageDto, { EditPageValidator } from "./dto/IEditPage.dto";
import { basename } from "path";
import IAddPhoto from "../photo/dto/IAddPhoto.dto";
import PhotoModel from "../photo/PhotoModel.model";
import { IEditPhoto } from "../photo/dto/IEditPhoto.dto";

class PageController extends BaseController {

    async getAllPages(req: Request, res: Response) {
      this.services.page.getAll(DefaultPageAdapterOptions)
      .then(result => {
        if (result.length === 0) {
          return res.status(404).send('Pages not found or deleted!');
        }
        else {
          return res.send(result);
        }

      })
       
    }

    async getPageById(req: Request, res: Response) {
        const pageId: number = +req.params?.pid;
    
            this.services.page.getById(pageId, DefaultPageAdapterOptions)
              .then(result => {
                if (result === null || result.isDeleted) {
                  return res.status(404).send('Page not found or deleted!');
                }
                else {
                  return res.send(result);
                }
          })

        }
      

    async addPage(req: Request, res: Response) {
        const data: IAddPageDto = req.body;
        if (!AddPageValidator(data)) {
          return res.status(400).send(AddPageValidator.errors);
        }    
          const payload = {title: data.title, content: data.content, alt_text: data?.altText};
          this.services.page.add(payload)
          .then(result => {
           return res.send(result);
          })
          .catch(error => {

            return res.status(500).send(error?.message);
          });
    
      }

      async uploadPagePhoto(req: Request, res: Response) {
        try {
          const pageId: number = +req.params?.pid;
          
          const uploadedFiles = await this.doFileUpload(req, res);
      
          if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).send('No files uploaded.');
          }
      
          let photos: PhotoModel[] = [];
          let photo = null;
          for (let singleFile of uploadedFiles) {
            const fileName = basename(singleFile);
      
            if (fileName.length > 64) {
              return res.status(400).send(`Photo ${fileName} must be no longer than 64 characters including spaces!`);
            }
            let data: IAddPhoto = {name: fileName, file_path: singleFile, page_id: pageId };
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
    
      async editPage(req: Request, res: Response) {
        const pageId: number = +req.params?.pid;
        const data: IEditPageDto = req.body;
        if (!EditPageValidator(data)) {
          return res.status(400).send(EditPageValidator.errors);
        }
        this.services.page.getById(pageId, DefaultPageAdapterOptions)
          .then(result => {
            if (result === null || result.isDeleted) {
              return res.status(404).send('Page not found or deleted!');
            }
              let payload = {title: data?.title, content: data?.content, alt_text: data.altText};
                this.services.page.editById(pageId, payload)
                  .then(result => {
                    return res.send(result);
                  })
                  .catch(error => {
                    return res.status(500).send(error?.message);
                  });
              })
      }

      async editPagePhoto(req: Request, res: Response) {
        try {
          const photoId: number = +req.params?.phid;
          const pageId: number = +req.params?.pid;
      
          const existingPhotos = await this.services.photo.getAllByPageId(pageId, {});
          const specificPhoto = existingPhotos.find((photo) => photo.photoId === photoId);

          if (!specificPhoto || specificPhoto.isDeleted ) {
            return res.status(404).send('Photo for the page is not found or it has been deleted!');
          }
            const uploadedFiles = await this.doFileUpload(req, res);
            let photo = null;
            let photos: PhotoModel[] = [];
            for (let singleFile of uploadedFiles) {
              const fileName = basename(singleFile);
              if (fileName.length > 64) {          
                return res.status(400).send(`Photo ${fileName} must be no longer than 64 characters including spaces!`);
              }
              let payload: IEditPhoto = {name: fileName, file_path: singleFile};
              photo = await this.services.photo.editById(photoId, payload);
             
              if (!photo) {
                return res.status(500).send("Failed to replace the photo in the database!");
              }
              photos.push(photo);
              
            }
            return res.send(photos);
        } catch (error) {
          return res.status(500).send(error?.message || 'An unexpected error occurred.');
        }
      }
    
    
      async deletePage(req: Request, res: Response) {
        const pageId: number = +req.params?.pid;
        this.services.page.getById(pageId, {loadPhotos: false})
          .then(async result => {
            if (result === null) {
              return res.status(404).send('Page not found or it is marked as deleted!');
            }
            const results = await this.services.photo.getAllByPageId(pageId);

            for(let result of results){
              let photoId = result.photoId;
              this.services.photo.deleteById(photoId);
            }
            this.services.page.deleteById(pageId)
              .then(result => {
                return res.send('This page has been deleted!');
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
export default PageController;