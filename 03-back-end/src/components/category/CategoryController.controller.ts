import { Request, Response } from 'express';
import { DefaultCategoryAdapterOptions } from './CategoryService.service';
import { AddCategoryValidator, IAddCategory } from '../category/dto/IAddCategory.dto';
import IAddCategoryDto from '../category/dto/IAddCategory.dto';
import IEditCategoryDto, { EditCategoryValidator } from './dto/IEditCategory.dto';
import BaseController from '../../common/BaseController';






class CategoryController extends BaseController {



  async getAll(req: Request, res: Response) {
    this.services.category.getThreeLevelDepth(DefaultCategoryAdapterOptions)
      .then(result => {
        return res.send(result);
      })
      .catch(error => {
        return res.status(500).send(error?.message);
      });
  }



  async getById(req: Request, res: Response) {
    const categoryId: number = +req.params?.id;

    try {
      const category = await this.services.category.getById(categoryId, DefaultCategoryAdapterOptions);

      if (category === null) {
        return res.status(404).send('Category not found.');
      }
      if(category.isDeleted){
        return res.status(404).send('Category has been deleted.');
      }
      
      if(category.categoryType === 'news'){
        return res.send(await this.services.category.getById(categoryId, {loadNews: true, loadProducts: false}));
      }
      else{
        return res.send(await this.services.category.getById(categoryId, {loadNews: false, loadProducts: true}));
      }

      
     ;
    } catch (error) {
      return res.status(500).send(error?.message);
    }
  }
  


  async add(req: Request, res: Response) {
    const data: IAddCategoryDto = req.body;
    if (!AddCategoryValidator(data)) {
      return res.status(400).send(AddCategoryValidator.errors);
    }
    
    
    const serviceData = await this.services.category.getById(data.parentCategoryId, DefaultCategoryAdapterOptions); 
    const parentCategory = serviceData.categoryType ?? ''; 
    const dataCategoryType = data.categoryType ?? '';
    if(serviceData.categoryType !== "root"){
    if (parentCategory.localeCompare(dataCategoryType) !== 0) {
        return res.status(409).json({ message: "Wrong category type!" });
    }
  }
      const payload : any= {
      name: data.name,
      category_type: data.categoryType,
      parent_id: data.parentCategoryId  
  };

    this.services.category.add(payload, DefaultCategoryAdapterOptions)
      .then(result => {
        return res.send(result);
      })
      .catch(error => {
        return res.status(400).send(error?.message);
      });
  }


  async edit(req: Request, res: Response) {
    const id: number = +req.params?.cid;
    const data: IEditCategoryDto = req.body;

    if (!EditCategoryValidator(data)) {
      return res.status(400).send(EditCategoryValidator.errors);
    }

    try {
        const category = await this.services.category.getById(id, DefaultCategoryAdapterOptions);
        const parentCategory = await this.services.category.getById(category.parentCategoryId, DefaultCategoryAdapterOptions);

        if (category === null) {
            return res.status(404).send('Category not found.');
        }
        if (parentCategory.name === (data.name)){
          return res.status(409).json({ message: "A category with this name already exists." });
        }
      
        const payload = {
          name: data.name,
          category_type: data.categoryType
      }
        const editedCategory = await this.services.category.editById(id, payload, DefaultCategoryAdapterOptions);

        return res.send(editedCategory);

    } catch (error) {
      return res.status(500).send(error?.message);
    }  
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
            return res.send('This category has been deleted!');
          })
          .catch(error => {
            return res.status(500).send(error?.message);
          })

      })
      .catch(error => {
        return res.status(500).send(error?.message);
      })
      .catch(error => {
        return res.status(500).send(error?.message);
      });
  }



}

export default CategoryController;