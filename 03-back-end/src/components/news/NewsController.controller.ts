import { Request, Response } from 'express';
import BaseController from '../../common/BaseController';
import IAddNewsDto, { AddNewsValidator } from './dto/IAddNews.dto';
import { DefaultCategoryAdapterOptions } from '../category/CategoryService.service';
import { DefaultNewsAdapterOptions } from '../news/NewsService.service';
import IEditNewsDto, { EditNewsValidator } from './dto/IEditNews.dto';
import { basename } from "path";

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

      const addedNews = await this.services.news.add({ title: (data as any).title, content: (data as any).content, alt_text: (data as any).altText || null, category_id: categoryId }, DefaultNewsAdapterOptions);
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
            if (result.title === data.title) {
              return res.status(400).send('Same title already exists in this category!');
            }
            if (result.categoryId !== categoryId) {
              return res.status(400).send('This news does not belong to this category!');
            }
            this.services.news.editById(newsId, { title: (data as any)?.title, content: (data as any)?.content, is_deleted: (data as any)?.isDeleted }, DefaultNewsAdapterOptions)
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
            const photos = [];
            for (let singleFile of uploadedFiles) {
              const fileName = basename(singleFile);
              if(fileName.length > 64){
                return res.status(400).send(`Photo ${fileName} must be no longer than 24 characters including spaces!`);
              }
              const photo = await this.services.photo.add({ name: fileName, file_path: singleFile, news_id: newsId }, {});

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
