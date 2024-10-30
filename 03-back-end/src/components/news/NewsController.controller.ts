import { Request, Response } from 'express';
import BaseController from '../../common/BaseController';
import IAddNewsDto, { AddNewsValidator } from './dto/IAddNews.dto';
import { DefaultCategoryAdapterOptions } from '../category/CategoryService.service';
import { DefaultNewsAdapterOptions } from '../news/NewsService.service';
import IEditNewsDto, { EditNewsValidator } from './dto/IEditNews.dto';
import { basename } from "path";
import PhotoModel from '../photo/PhotoModel.model';
import { IEditPhoto } from '../photo/dto/IEditPhoto.dto';
import IAddPhoto from '../photo/dto/IAddPhoto.dto';

export class NewsController extends BaseController {

  async getAllNewsByCategoryId(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
      .then(result => {
        if (result === null) {
          return res.status(404).send("Category not found!");
        }
        if (result.categoryType !== 'news') {
          return res.status(400).send("Wrong category!");
        }

        this.services.news.getAllByCategoryId(categoryId, {
          loadPhotos: true, loadCategory: true
        })
          .then(result => {
            return res.send(result);
          })
          .catch(error => {
            return res.status(500).send(error?.message);
          });
      })
      .catch(error => {
        return res.status(500).send(error?.message);
      });
  }




  async getNewsById(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const newsId: number = +req.params?.nid;

    this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
      .then(result => {
        if (result === null) {
          return res.status(404).send('Category not found!');
        }
        if (result.categoryType !== 'news') {
          return res.status(400).send("Wrong category!");
        }
      
        this.services.news.getById(newsId, { loadPhotos: true, loadCategory: true })
          .then(result => {
            if (result === null) {
              return res.status(404).send('News not found!');
            }
            if(result.isDeleted){
              return res.status(404).send('News is deleted.');
            }
            else {
              return res.send(result);
            }
          });
      })
      .catch(error => {
        return res.status(500).send(error?.message);
      });
  }


  async addNews(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const data: IAddNewsDto = req.body;
    if (!AddNewsValidator(data)) {
      return res.status(400).send(AddNewsValidator.errors);
    }

    try {
      const category = await this.services.category.getById(categoryId, DefaultCategoryAdapterOptions);

      if (category === null || category.isDeleted) {
        return res.status(404).send('Category not found.');
      }
      if (category.categoryType !== 'news') {
        return res.status(400).send('Adding in wrong category!');
      }
      if (category.news.find(news => news.title.trim().toLowerCase() === data.title.trim().toLowerCase())) {
        return res.status(400).send('There is already same news title in this category!');
      }

     const payload = { title: data.title, content: data.content, alt_text: data?.altText ,category_id: categoryId };

      const addedNews = await this.services.news.add( payload, DefaultNewsAdapterOptions);
      return res.send(addedNews);
    } catch (error) {
      return res.status(500).send(error?.message);
    }

  }

  async editNews(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const newsId: number = +req.params?.nid;
    const data: IEditNewsDto = req.body;
    if (!EditNewsValidator(data)) {
      return res.status(400).send(EditNewsValidator.errors);
    }
    this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
      .then(result => {
        if (result === null) {
          return res.status(404).send('Category not found!');
        }

        this.services.news.getById(newsId, DefaultNewsAdapterOptions)
          .then(result => {
            if (result === null) {
              return res.status(404).send('News not found!');
            }
           
            if (result.categoryId !== categoryId) {
              return res.status(400).send('This news does not belong to this category!');
            }
            const payload = { title: data?.title, content: data?.content, alt_text: data?.altText }
            this.services.news.editById(newsId, payload, DefaultNewsAdapterOptions)
              .then(result => {
                return res.send(result);
              })
              .catch(error => {
                return res.status(400).send(error?.message);
              });
          });
      })
      .catch(error => {
        return res.status(500).send(error?.message);
      });

  }

  async editNewsPhoto(req: Request, res: Response) {
    try {
      const photoId: number = +req.params?.phid;
      const newsId: number = +req.params?.nid;
      
      const existingPhotos = await this.services.photo.getAllByNewsId(newsId, {});
      const specificPhoto = existingPhotos.find((photo) => photo.photoId === photoId);

      if (!specificPhoto || specificPhoto.isDeleted ) {
        return res.status(404).send('Photo for the these news is not found or it has been deleted!');
       
      }
        const uploadedFiles = await this.doFileUpload(req, res);
        let photo = null;
        const photos : PhotoModel[]= [];
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
    } catch (error) {
      return res.status(500).send(error?.message || 'An unexpected error occurred.');
    }
  }



  async deleteNews(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const newsId: number = +req.params?.nid;
    this.services.news.getById(newsId, DefaultNewsAdapterOptions)
      .then(async result => {
        if (result === null || result.isDeleted) {
          return res.status(404).send('News not found or deleted!');
        }

        if (result.categoryId !== categoryId) {
          return res.status(400).send('This news does not belong to this category!');
        }
        const results = await this.services.photo.getAllByNewsId(newsId, DefaultNewsAdapterOptions);

        for(let result of results){
          let photoId = result.photoId;
          this.services.photo.deleteById(photoId);
        }

        this.services.news.deleteById(newsId)
          .then(result => {
            return res.send('This news has been deleted! ');
          })
          .catch(error => {
            return res.status(500).send(error?.message);
          });
      })

      .catch(error => {
        return res.status(500).send(error?.message);
      });

  }
  async uploadPhoto(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const newsId: number = +req.params?.nid;
    this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
      .then(result => {
        if (result === null) {
          return res.status(404).send("Category not found!");
        }
        this.services.news.getById(newsId, DefaultNewsAdapterOptions)
          .then(async (result) => {
            if (result === null) {
              return res.status(404).send("News not found!");
            }

            const uploadedFiles =  await this.doFileUpload(req, res);

            if (uploadedFiles === null) {
              return;
            }
            const photos: PhotoModel[] = [];
            for (let singleFile of uploadedFiles) {
              const fileName = basename(singleFile);
              if(fileName.length > 64){
                return res.status(400).send(`Photo ${fileName} must be no longer than 24 characters including spaces!`);
              }
              const data: IAddPhoto = { name: fileName, file_path: singleFile, news_id: newsId };
              const photo = await this.services.photo.add(data, {});

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
