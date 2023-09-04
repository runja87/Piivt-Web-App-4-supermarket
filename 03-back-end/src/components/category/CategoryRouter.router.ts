import CategoryController from "./CategoryController.controller";
import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';


class CategoryRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const categoryController: CategoryController = new CategoryController(resources.services);

        application.get("/api/category", categoryController.getAll.bind(categoryController));
        application.get("/api/category/:id", categoryController.getById.bind(categoryController));
        application.post("/api/category", categoryController.add.bind(categoryController));
        application.put("/api/category/:cid", categoryController.edit.bind(categoryController));
        application.post("/api/category/:cid/news", categoryController.addNews.bind(categoryController));
        application.post("/api/category/:cid/product", categoryController.addProduct.bind(categoryController));
        application.put("/api/category/:cid/news/:nid", categoryController.editNews.bind(categoryController));
        application.put("/api/category/:cid/product/:pid", categoryController.editProduct.bind(categoryController));
        application.delete("/api/category/:cid/news/:nid", categoryController.deleteNews.bind(categoryController));
        application.delete("/api/category/:cid/product/:pid", categoryController.deleteProduct.bind(categoryController));
           
        
    }

}
export default CategoryRouter;