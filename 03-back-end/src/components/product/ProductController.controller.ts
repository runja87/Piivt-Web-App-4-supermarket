import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import IAddProductDto, { AddProductValidator } from "./dto/IAddProduct.dto";
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
import { DefaultProductAdapterOptions } from '../product/ProductService.service';
import IEditProductDto, { EditProductValidator } from "./dto/IEditProduct.dto";
import { basename } from "path";
import { ISearchProductDto, SearchProductValidator } from "./dto/ISearchProduct.dto";
import PhotoModel from "../photo/PhotoModel.model";
import { IEditPhoto } from "../photo/dto/IEditPhoto.dto";
import IPhoto from '../../../../04-front-end/src/models/IPhoto.model';
import IAddPhoto from "../photo/dto/IAddPhoto.dto";


class ProductController extends BaseController {

  async getAllProductsByCategoryId(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    this.services.category.getById(categoryId, DefaultCategoryAdapterOptions)
      .then(result => {
        if (result === null) {
          return res.status(404).send("Category not found!");
        }
        if (result.categoryType !== 'product') {
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

  async getBySearchParams(req: Request, res: Response) {

    const { search, category, minPrice, maxPrice } = req.query as {
      search?: string;
      category?: string;
      minPrice?: string;
      maxPrice?: string;
    };

    if (!SearchProductValidator({ search, category, minPrice, maxPrice })) {
      return res.status(400).json(SearchProductValidator.errors);
    }

    try {

      const searchPayload = {
        search: (search ?? "").toString(),
        category: (category ?? "").toString(),
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
      };


      const products = await this.services.product.getBySearchParams(
        searchPayload,
        { loadCategory: true, loadPhotos: true }
      );


      if (!Array.isArray(products) || products.length === 0) {
        return res.status(200).json({ products: [], relatedProducts: [] });
      }

      let catId = Number(category);
      if (!Number.isFinite(catId)) {

        const p0: any = products[0];
        catId =
          p0?.category?.categoryId ??
          p0?.categories?.[0]?.categoryId ??
          NaN;
      }

      let relatedProducts: any[] = [];

      if (Number.isFinite(catId)) {

        relatedProducts = await this.services.product.getRelated(
          catId as number,
          "category_id",
          { loadCategory: true, loadPhotos: true }
        );


        const excludeIds = new Set(products.map((p: any) => p.productId));
        relatedProducts = (relatedProducts ?? []).filter(
          (rp: any) => !excludeIds.has(rp.productId)
        );


        relatedProducts = relatedProducts.slice(0, 8);
      }

      return res.status(200).json({ products, relatedProducts });
    } catch (error: any) {
      console.error("getBySearchParams error:", error);
      return res.status(500).json({ message: error?.message ?? "Server error" });
    }
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

        this.services.product.getById(productId, { loadCategory: true, loadPhotos: true })
          .then(result => {
            if (result === null) {
              return res.status(404).send('Product not found!');
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



  async addProduct(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const data: IAddProductDto = req.body;
    if (!AddProductValidator(data)) {
      return res.status(400).send(AddProductValidator.errors);
    }
    try {
      const category = await this.services.category.getById(categoryId, {
        loadNews: false,
        loadProducts: true
      });

      if (category === null) {
        return res.status(404).send('Category not found.');
      }
      if (category.categoryType !== 'product') {
        return res.status(400).send('Adding in wrong category!');
      }

      if (category.products.find(product => product.name.trim().toLowerCase() === data.name.trim().toLowerCase())) {
        return res.status(400).send('There is already same product name in this category!');
      }

      const productData = {
        name: data.name,
        description: data.description,
        alt_text: data.altText,
        price: data.price,
        sku: data.sku,
        supply: data.supply,
        category_id: categoryId
      };
      const addedProduct = await this.services.product.add(productData, DefaultProductAdapterOptions);
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

        this.services.product.getById(productId, DefaultProductAdapterOptions)
          .then(result => {
            if (result === null) {
              return res.status(404).send('Product not found!');
            }
            if (result.categoryId !== categoryId) {
              return res.status(400).send('This product does not belong to this category!');
            }

            const productData = {
              name: data.name,
              description: data.description,
              alt_text: data?.altText,
              price: data.price,
              sku: data.sku,
              supply: data.supply,
              discount: data?.discount || "0.1",
              is_on_discount: data?.isOnDiscount || 0
            };

            this.services.product.editById(productId, productData, DefaultProductAdapterOptions)
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

  async editProductPhoto(req: Request, res: Response) {
    try {
      const photoId: number = +req.params?.phid;
      const productId: number = +req.params?.pid;

      const existingPhotos = await this.services.photo.getAllByProductId(productId, {});
      const specificPhoto = existingPhotos.find((photo) => photo.photoId === photoId);

      if (!specificPhoto || specificPhoto.isDeleted) {
        return res.status(404).send('Photo for this product is not found or it has been deleted!');
      }
      const uploadedFiles = await this.doFileUpload(req, res);
      let photo = null;
      let photos: PhotoModel[] = [];
      for (let singleFile of uploadedFiles) {
        const fileName = basename(singleFile);

        if (fileName.length > 64) {
          return res.status(400).send(`Photo ${fileName} must be no longer than 64 characters including spaces!`);
        }
        const payload: IEditPhoto = { name: fileName, file_path: singleFile };
        photo = await this.services.photo.editById(photoId, payload);

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



  async deleteProduct(req: Request, res: Response) {
    const categoryId: number = +req.params?.cid;
    const productId: number = +req.params?.pid;
    this.services.product.getById(productId, DefaultProductAdapterOptions)
      .then(async result => {
        if (result === null) {
          return res.status(404).send('Product not found or is as marked deleted!');
        }

        if (result.categoryId !== categoryId) {
          return res.status(400).send('This product does not belong to this category!');
        }

        const results = await this.services.photo.getAllByProductId(productId, DefaultProductAdapterOptions);

        for (let result of results) {
          let photoId = result.photoId;
          this.services.photo.deleteById(photoId);
        }

        this.services.product.deleteById(productId)
          .then(() => {
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

        this.services.product.getById(productId, DefaultProductAdapterOptions)
          .then(async (result) => {
            if (result === null) {
              return res.status(404).send("Product not found!");
            }

            if (result.categoryId !== categoryId) {
              return res.status(400).send('This product does not belong to this category!');
            }

            const uploadedFiles = await this.doFileUpload(req, res);

            if (uploadedFiles === null) {
              return;
            }
            const photos: PhotoModel[] = [];
            for (let singleFile of uploadedFiles) {
              const fileName = basename(singleFile);
              if (fileName.length > 64) {
                return res.status(400).send(`Photo ${fileName} must be no longer than 24 characters including spaces!`);
              }
              const payload: IAddPhoto = { name: fileName, file_path: singleFile, product_id: productId };
              const photo: PhotoModel = await this.services.photo.add(payload);

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