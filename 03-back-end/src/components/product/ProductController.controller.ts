import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import IAddProductDto, { AddProductValidator } from "./dto/IAddProduct.dto";
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
import IEditProductDto, { EditProductValidator } from "./dto/IEditProduct.dto";

class ProductController extends BaseController {

    async getAllProductsByCategoryId(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found!");
            }

            this.services.product.getAllByCategoryId(categoryId, {
                loadNews: false, loadProducts: true 
            })
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }




    async getProductById(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const productId: number = +req.params?.pid;
    
        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
          .then(result => {
            if (result === null) {
              return res.status(404).send('Category not found!');
            }
    
            this.services.product.getById(productId, {loadNews: false, loadProducts: true})
              .then(result => {
                if (result === null) {
                  return res.status(404).send('Product not found!');
                }
                else {
                  return res.send(result);
                }
              });
            })
            .catch(error =>{
              res.status(500).send(error?.message);
            });
          }



    async addProduct(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const data: IAddProductDto = req.body;
        if (!AddProductValidator(data)) {
          return res.status(400).send(AddProductValidator.errors);
        }
        try {
          const category = await this.services.category.getById(categoryId, DefaultCategoryAdapterOptions);
    
          if (category === null) {
            return res.status(404).send('Category not found.');
          }
          if (category.categoryType !== 'product') {
            return res.status(400).send('Adding in wrong category!');
          }
          const productData = {
            name: (data as any).name,
            description: (data as any).description,
            alt_text: (data as any).altText || null,
            price: (data as any).price,
            sku: (data as any).sku,
            supply: (data as any).supply,
            category_id: categoryId
          };
          const addedProduct = await this.services.product.add(productData);
          res.send(addedProduct);
        } catch (error) {
          res.status(500).send(error?.message);
        }
    
      }
    
      async editProduct(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const productId: number = +req.params?.pid;
        const data: IEditProductDto = req.body;
        if (!EditProductValidator(data)) {
          return res.status(400).send(EditProductValidator.errors);
        }
        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
          .then(result => {
            if (result === null) {
              return res.status(404).send('Category not found!');
            }
    
            this.services.product.getById(productId, {})
              .then(result => {
                if (result === null) {
                  return res.status(404).send('Product not found!');
                }
                if (result.categoryId !== categoryId) {
                    return res.status(400).send('This product does not belong to this category!');
                  }
                if (result.name === data.name) {
                  return res.status(400).send('There is already same title in this category!');
                }
              
    
                const productData = {
                  name: (data as any).name,
                  description: (data as any).description,
                  alt_text: (data as any).altText || null,
                  price: (data as any).price,
                  sku: (data as any).sku,
                  supply: (data as any).supply,
                  discount: (data as any).discount || null,
                  is_on_discount: (data as any).isOnDiscount || 0,
                  is_deleted: (data as any).isDeleted,
                  category_id: categoryId
                };
    
                this.services.product.editById(productId, productData)
                  .then(result => {
                    res.send(result);
                  })
                  .catch(error => {
    
                    res.status(500).send(error?.message);
                  });
              })
    
              .catch(error => {
                res.status(500).send(error?.message);
              });
          })
    
    
      }
    
    
      async deleteProduct(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const productId: number = +req.params?.pid;
        this.services.product.getById(productId, {})
          .then(result => {
            if (result === null) {
              return res.status(404).send('Product not found or is as marked deleted!');
            }
    
            if (result.categoryId !== categoryId) {
              return res.status(400).send('This product does not belong to this category!');
            }
            this.services.product.deleteById(productId)
              .then(result => {
                res.send('This product has been deleted!');
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
export default ProductController;