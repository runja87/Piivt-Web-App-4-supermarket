import CategoryController from "../category/CategoryController.controller";
import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import ProductController from "../product/ProductController.controller";
import { NewsController } from "../news/NewsController.controller";
import AuthMiddleware from "../../middlewares/AuthMiddleware";


class CategoryRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const categoryController: CategoryController = new CategoryController(resources.services);
        const newsController: NewsController = new NewsController(resources.services);
        const productController: ProductController = new ProductController(resources.services);

        application.get("/api/category",                                                         categoryController.getAll.bind(categoryController));
        application.get("/api/category/product/search?:queryParams",                             productController.getBySearchParams.bind(productController));
        application.get("/api/category/:id",                                                     categoryController.getById.bind(categoryController));
        application.get("/api/category/:cid/news/:nid",                                          newsController.getNewsById.bind(newsController));
        application.get("/api/category/:cid/news",                                               newsController.getAllNewsByCategoryId.bind(newsController));
        application.get("/api/category/:cid/product",                                            productController.getAllProductsByCategoryId.bind(productController));
        application.get("/api/category/:cid/product/:pid",                                       productController.getProductById.bind(productController)); 
        application.post("/api/category",                                    AuthMiddleware.getVerified(),categoryController.add.bind(categoryController));
        application.post("/api/category/:cid/news",                          AuthMiddleware.getVerified(),newsController.addNews.bind(newsController));
        application.post("/api/category/:cid/news/:nid/photo",               AuthMiddleware.getVerified(),newsController.uploadPhoto.bind(newsController));
        application.put("/api/category/:cid/news/:nid/photo/:phid",           AuthMiddleware.getVerified(),newsController.editNewsPhoto.bind(newsController));
        application.post("/api/category/:cid/product/:pid/photo",            AuthMiddleware.getVerified(),productController.uploadPhoto.bind(productController));
        application.put("/api/category/:cid/product/:pid/photo/:phid",       AuthMiddleware.getVerified(),productController.editProductPhoto.bind(productController));
        application.post("/api/category/:cid/product",                       AuthMiddleware.getVerified(),productController.addProduct.bind(productController));
        application.put("/api/category/:cid/news/:nid",                      AuthMiddleware.getVerified(),newsController.editNews.bind(newsController));
        application.put("/api/category/:cid",                                AuthMiddleware.getVerified(),categoryController.edit.bind(categoryController));
        application.put("/api/category/:cid/product/:pid",                   AuthMiddleware.getVerified(),productController.editProduct.bind(productController));
        application.delete("/api/category/:cid/news/:nid",                   AuthMiddleware.getVerified(),newsController.deleteNews.bind(newsController));
        application.delete("/api/category/:cid/product/:pid",                AuthMiddleware.getVerified(),productController.deleteProduct.bind(productController));
        application.delete("/api/category/:cid",                             AuthMiddleware.getVerified(),categoryController.deleteCategory.bind(categoryController));

           
        
    }

}
export default CategoryRouter;