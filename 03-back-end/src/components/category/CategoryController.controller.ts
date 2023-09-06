import { Request, Response } from 'express';
import { DefaultCategoryAdapterOptions } from './CategoryService.service';
import { AddCategoryValidator } from '../category/dto/IAddCategory.dto';
import IAddCategoryDto from '../category/dto/IAddCategory.dto';
import IEditCategoryDto, { EditCategoryValidator } from './dto/IEditCategory.dto';
import BaseController from '../../common/BaseController';





class CategoryController extends BaseController {



  async getAll(req: Request, res: Response) {
    this.services.category.getThreeLevelDepth(DefaultCategoryAdapterOptions)
      .then(result => {
        res.send(result);
      })
      .catch(error => {
        res.status(500).send(error?.message);
      });
  }



  async getById(req: Request, res: Response) {
    const id: number = +req.params?.id;

    try {
      const category = await this.services.category.getById(id, DefaultCategoryAdapterOptions);

      if (category === null) {
        return res.status(404).send('Category not found.');
      }
      if(category.isDeleted){
        return res.status(404).send('Category has been deleted.');
      }

      let loadNews = category.categoryType === 'news';
      let loadProducts = !loadNews;

      const detailedCategory = await this.services.category.getById(id, { loadNews, loadProducts });

      res.send(detailedCategory);
    } catch (error) {
      res.status(500).send(error?.message);
    }
  }



  async add(req: Request, res: Response) {
    const data: IAddCategoryDto = req.body;
    if (!AddCategoryValidator(data)) {
      return res.status(400).send(AddCategoryValidator.errors);
    }

    this.services.category.add({ name: (data as any).name, category_type: (data as any).categoryType, parent_id: (data as any).parentCategoryId }, DefaultCategoryAdapterOptions)
      .then(result => {
        res.send(result);
      })
      .catch(error => {
        res.status(400).send(error?.message);
      });
  }


  async edit(req: Request, res: Response) {
    const id: number = +req.params?.cid;
    const data: IEditCategoryDto = req.body;
    if (!EditCategoryValidator(data)) {
      return res.status(400).send(EditCategoryValidator.errors);
    }

    this.services.category.getById(id, DefaultCategoryAdapterOptions)
      .then(result => {
        if (result === null ) {
          return res.sendStatus(404).send('Category not found.');
        }
       
        this.services.category.editById(id, { name: (data as any).name, is_deleted: (data as any).isDeleted, category_type: (data as any).categoryType }, DefaultCategoryAdapterOptions)
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

  async deleteCategory(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
      .then(result => {
        if (result === null) {
          return res.status(404).send('Category not found or is as marked deleted!');
        }
        this.services.category.deleteById(categoryId)
          .then(result => {
            res.send('This category has been deleted!');
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