import CategoryModel from './model';
import { Request, Response, NextFunction } from 'express';
import CategoryService from './service';
class CategoryController {
    private categoryService: CategoryService;
    constructor(categoryService: CategoryService){
        this.categoryService = categoryService;
    }
  async getAll(req: Request, res: Response, next: NextFunction){
    const categories = await this.categoryService.getAll();
    res.send(categories);
  }

  }
export default CategoryController;