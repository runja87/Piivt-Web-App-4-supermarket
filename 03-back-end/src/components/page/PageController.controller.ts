import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import IAddPageDto, { AddPageValidator } from "./dto/IAddPage.dto";
import { DefaultPageAdapterOptions } from "../page/PageService.service";
import { DefaultCategoryAdapterOptions } from '../category/CategoryService.service';
import IEditPageDto, { EditPageValidator } from "./dto/IEditPage.dto";
import { basename } from "path";

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
        
          this.services.page.add({title: (data as any).title, content: (data as any).content, alt_text: (data as any).altText})
          .then(result => {
           return res.send(result);
          })
          .catch(error => {

            return res.status(500).send(error?.message);
          });
    
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
    
                this.services.page.editById(pageId, {title: (data as any).title, content: (data as any).content, alt_text: (data as any).altText, is_deleted: (data as any).isDeleted})
                  .then(result => {
                    return res.send(result);
                  })
                  .catch(error => {
                    return res.status(500).send(error?.message);
                  });
              })
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

      async uploadPhoto(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const pageId: number = +req.params?.pid;
        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
          .then(result => {
            if (result === null) {
              return res.status(404).send("Category not found!");
            }
            this.services.page.getById(pageId, {loadPhotos: false})
              .then(async (result) => {
                if (result === null) {
                  return res.status(404).send("Page not found!");
                }
    
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
                  const photo = await this.services.photo.add({ name: fileName, file_path: singleFile, page_id: pageId }, {});
    
                  if (photo === null) {
                    return res.status(500).send("Failed to add this photo into the database!");
                  }
                  photos.push(photo);
                }
    
               return res.send(photos);
              })
              .catch(error => {
                if (!res.headersSent) {
                  return res.status(500).send(error?.message);
                }
              });
          })
          .catch(error => {
            return res.status(500).send(error?.message);
          });
      }
    

}
export default PageController;