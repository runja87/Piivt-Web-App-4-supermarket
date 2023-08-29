import { Request, Response } from 'express';
import { DefaultCategoryAdapterOptions } from './CategoryService.service';
import IAddNewsDto, { AddNewsValidator } from '../news/dto/IAddNews.dto';
import { AddCategoryValidator } from '../category/dto/IAddCategory.dto';
import IAddCategoryDto from '../category/dto/IAddCategory.dto';
import IEditCategoryDto, { EditCategoryValidator } from './dto/IEditCategory.dto';
import { EditNewsValidator } from '../news/dto/IEditNews.dto';
import IEditNewsDto from '../news/dto/IEditNews.dto';
import BaseController from '../../common/BaseController';




class CategoryController extends BaseController {



  getAll(req: Request, res: Response) {
    this.services.category.getAll(DefaultCategoryAdapterOptions)
      .then(result => {
        res.send(result);
      })
      .catch(error => {
        res.status(500).send(error?.message);
      });
  }



  getById(req: Request, res: Response) {
    const id: number = +req.params?.id;
    this.services.category.getById(id, { loadNews: true, loadProducts: false })
      .then(result => {
        if (result === null) {
          return res.sendStatus(404);
        }
        res.send(result);
      })
      .catch(error => {
        res.status(500).send(error?.message);
      });

  }

  add(req: Request, res: Response) {
    const data = req.body as IAddCategoryDto;
    if (!AddCategoryValidator(data)) {
      return res.status(400).send(AddCategoryValidator.errors);
    }

    this.services.category.add({ name: data.name, category_type: data.category_type, category__id: data.category__id }, {loadNews: false, loadProducts:false})
      .then(result => {
        res.send(result);
      })
      .catch(error => {
       res.status(400).send(error?.message);
      });
  }


  edit(req: Request, res: Response) {
    const id: number = +req.params?.cid;
    const data = req.body as IEditCategoryDto;
    if (!EditCategoryValidator(data)) {
      return res.status(400).send(EditCategoryValidator.errors);
    }

    this.services.category.getById(id, { loadNews: false, loadProducts: false })
      .then(result => {
        if (result === null) {
          return res.sendStatus(404);
        }
        this.services.category.editById(id, { name: data.name, category_type: data.category_type, category__id: data.category__id }, { loadNews: true, loadProducts: false })
          .then(result => {
            res.send(result);
          })
          .catch(error => {
            res.status(400).send(error?.message);
          });
      })
      .catch(error => {
        res.status(500).send(error?.message);
      });
  }




  addNews(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const data = req.body as IAddNewsDto;
    if (!AddNewsValidator(data)) {
      return res.status(400).send(AddNewsValidator.errors);
    }
    this.services.category.getById(categoryId, { loadNews: false, loadProducts: false })
      .then(result => {
        if (result === null) {
          return res.sendStatus(404);
        }
        this.services.news.add({ title: data.title, content: data.content, alt_text: data.alt_text, category_id: categoryId })
          .then(result => {

            res.send(result);
          })
          .catch(error => {
            res.status(400).send(error?.message);
          });

      })
      .catch(error => {
        res.status(500).send(error?.message);
      });
  }

  editNews(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const newsId: number = +req.params?.iid;
    const data: IEditNewsDto = req.body as IEditNewsDto;
    if (!EditNewsValidator(data)) {
      return res.status(400).send(EditNewsValidator.errors);
    }
    this.services.news.getById(categoryId, { loadNews: false, loadProducts: false })
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
              return res.status(400).send('There is already have a same title in this category!');
            }
            if (result.categoryId !== categoryId) {
              return res.status(400).send('This news does not belong to this category!');
            }
            this.services.news.editById(newsId, {title: data.title, content: data.content, alt_text: data.alt_text, category_id: categoryId})
              .then(result => {
                res.send(result);
              })
          });
      })
      .catch(error => {
        res.status(500).send(error?.message);
      });

  }
  deleteNews(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const newsId: number = +req.params?.iid;
    this.services.news.getById(newsId, {})
      .then(result => {
        if (result === null) {
          return res.status(404).send('News not found!');
        }

        if (result.categoryId !== categoryId) {
          return res.status(400).send('This news does not belong to this category!');
        }
        this.services.news.deleteById(newsId)
          .then(result => {
            res.send('This news has been deleted!  ');
          })
          .catch(error => {
            res.status(500).send(error?.message);
          })
      })
      .catch(error => {
        res.status(500).send(error?.message);
      })
      .catch(error => {
        res.status(500).send(error?.message);
      });
  }

}

export default CategoryController;