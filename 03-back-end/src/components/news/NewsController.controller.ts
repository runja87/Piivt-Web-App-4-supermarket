import { Request, Response } from 'express';
import BaseController from '../../common/BaseController';
import IAddNewsDto, { AddNewsValidator } from './dto/IAddNews.dto';
import { DefaultCategoryAdapterOptions } from '../category/CategoryService.service';
import IEditNewsDto, { EditNewsValidator } from './dto/IEditNews.dto';
import { mkdirSync, readFileSync } from 'fs';
import { UploadedFile } from 'express-fileupload';
import filetype from 'magic-bytes.js';
import { extname } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";






class NewsController extends BaseController {

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
          loadNews: true, loadProducts: false
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

        this.services.news.getById(newsId, { loadNews: true, loadProducts: false })
          .then(result => {
            if (result === null) {
              return res.status(404).send('News not found!');
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

      const addedNews = await this.services.news.add({ title: (data as any).title, content: (data as any).content, alt_text: (data as any).altText, category_id: categoryId })
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

        this.services.news.getById(newsId, {})
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
            this.services.news.editById(newsId, { title: (data as any).title, content: (data as any).content, alt_text: (data as any).altText, category_id: categoryId })
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
    this.services.news.getById(newsId, {})
      .then(result => {
        if (result === null || result.isDeleted) {
          return res.status(404).send('News not found or deleted!');
        }

        if (result.categoryId !== categoryId) {
          return res.status(400).send('This news does not belong to this category!');
        }

        this.services.news.deleteById(newsId)
          .then(result => {
            return res.send('This news has been deleted! ');
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
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No file were uploaded!")
    }
    const fileFieldNames = Object.keys(req.files)
    const now = new Date();
    const year = now.getFullYear();
    const month = ((now.getMonth() + 1) + "").padStart(2, "0");

    const uploadDestinationRoot = "./static/";
    const destinationDirectory = "uploads" + year + "/" + month + "/";
    mkdirSync(uploadDestinationRoot + destinationDirectory, {
      recursive: true, mode: 755,

    });
    const uploadedFiles = [];

    for (let fileFieldName of fileFieldNames) {
      const file = req.files[fileFieldName] as UploadedFile;
      const type = filetype(readFileSync(file.tempFilePath))[0].typename;
      if (!["png", "jpg"].includes(type)) {
        return res.status(415).send(`File ${fileFieldName} - type is not supported`);
      }
      const declaredExtension: string = extname(file.name);
      if (![".png", ".jpg"].includes(declaredExtension)) {
        return res.status(415).send(`File ${fileFieldName} - extension is not supported!`);
      }
      const size = sizeOf(file.tempFilePath);
      if (size.width < 320 || size.width > 1920) {
        return res.status(445).send(`File ${fileFieldName} - image width is not supported!`);
      }
      if (size.height < 240 || size.height > 1080) {
        return res.status(445).send(`File ${fileFieldName} - image height is not supported!`);
      }
      const fileNameRandomPart = uuid.v4();
      const fileDestinationPath = uploadDestinationRoot + destinationDirectory + fileNameRandomPart + "-" + file.name;

      file.mv(fileDestinationPath, error => {
        return res.status(500).send(error);
      });
      uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-" + file.name);
    }
    res.send(uploadedFiles);
  }




}




export default NewsController;


