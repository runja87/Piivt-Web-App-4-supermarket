import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import IAddProductDto, { AddProductValidator } from "./dto/IAddProduct.dto";
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
import { DefaultProductAdapterOptions } from '../product/ProductService.service';
import IEditProductDto, { EditProductValidator } from "./dto/IEditProduct.dto";
import { basename } from "path";

class ProductController extends BaseController {

    async getAllProductsByCategoryId(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found!");
            }
            if(result.categoryType !== 'product'){
              return res.status(400).send("Wrong category!");
            }

            this.services.product.getAllByCategoryId(categoryId, {
                loadCategory: true, loadPhotos: true 
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




    async getProductById(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const productId: number = +req.params?.pid;
    
        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
          .then(result => {
            if (result === null) {
              return res.status(404).send('Category not found or product deleted!');
            }
            if (result.categoryType !== 'product') {
              return res.status(400).send('Wrong category!');
            }
    
            this.services.product.getById(productId, {loadCategory: true, loadPhotos: true})
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
              return res.status(500).send(error?.message);
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
          const addedProduct = await this.services.product.add(productData, {loadCategory: false, loadPhotos: false});
          return res.send(addedProduct);
        } catch (error) {
          return res.status(500).send(error?.message);
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
    
            this.services.product.getById(productId, {loadCategory: false, loadPhotos: false})
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
                  category_id: categoryId
                };
    
                this.services.product.editById(productId, productData, {loadCategory: false, loadPhotos: false})
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
          })
    
    
      }
    
    
      async deleteProduct(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const productId: number = +req.params?.pid;
        this.services.product.getById(productId, {loadCategory: false,loadPhotos: false})
          .then(async result => {
            if (result === null) {
              return res.status(404).send('Product not found or is as marked deleted!');
            }
    
            if (result.categoryId !== categoryId) {
              return res.status(400).send('This product does not belong to this category!');
            }

            const results = await this.services.photo.getAllByProductId(productId, DefaultProductAdapterOptions);

            for(let result of results){
              let photoId = result.photoId;
              this.services.photo.deleteById(photoId);
            }

            this.services.product.deleteById(productId)
              .then(result => {
                return res.send('This product has been deleted!');
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
        const productId: number = +req.params?.pid;
        this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
          .then(result => {
            if (result === null) {
              return res.status(404).send("Category not found!");
            }
         
            this.services.product.getById(productId, {loadCategory: false, loadPhotos: false})
              .then(async (result) => {
                if (result === null) {
                  return res.status(404).send("Product not found!");
                }

                if (result.categoryId !== categoryId) {
                  return res.status(400).send('This product does not belong to this category!');
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
                  const photo = await this.services.photo.add({ name: fileName, file_path: singleFile, product_id: productId }, {});
    
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
export default ProductController;