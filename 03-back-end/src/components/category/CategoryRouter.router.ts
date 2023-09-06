import CategoryController from "../category/CategoryController.controller";
import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import NewsController from "../news/NewsController.controller";
import ProductController from "../product/ProductController.controller";


class CategoryRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const categoryController: CategoryController = new CategoryController(resources.services);
        const newsController: NewsController = new NewsController(resources.services);
        const productController: ProductController = new ProductController(resources.services);

        application.get("/api/category",                            categoryController.getAll.bind(categoryController));
        application.get("/api/category/:id",                        categoryController.getById.bind(categoryController));
        application.get("/api/category/:cid/news/:nid",             newsController.getNewsById.bind(newsController));
        application.get("/api/category/:cid/news",                  newsController.getAllNewsByCategoryId.bind(newsController));
        application.get("/api/category/:cid/product",               productController.getAllProductsByCategoryId.bind(productController));
        application.get("/api/category/:cid/product/:pid",          productController.getProductById.bind(productController)); 
        application.post("/api/category",                           categoryController.add.bind(categoryController));
        application.post("/api/category/:cid/news",                 newsController.addNews.bind(newsController));
        application.post("/api/category/:cid/news/:iid/photo",      newsController.uploadPhoto.bind(newsController));
        application.post("/api/category/:cid/product",              productController.addProduct.bind(productController));
        application.put("/api/category/:cid/news/:nid",             newsController.editNews.bind(newsController));
        application.put("/api/category/:cid",                       categoryController.edit.bind(categoryController));
        application.put("/api/category/:cid/product/:pid",          productController.editProduct.bind(productController));
        application.delete("/api/category/:cid/news/:nid",          newsController.deleteNews.bind(newsController));
        application.delete("/api/category/:cid/product/:pid",       productController.deleteProduct.bind(productController));
        application.delete("/api/category/:cid",                    categoryController.deleteCategory.bind(categoryController));
           
        
    }

}
export default CategoryRouter;