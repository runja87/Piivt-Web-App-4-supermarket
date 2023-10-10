import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import PageController from "./PageController.controller";
import AuthMiddleware from '../../middlewares/AuthMiddleware';


class PageRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const pageController: PageController = new PageController(resources.services);

        application.get("/api/page",                                                         pageController.getAllPages.bind(pageController));
        application.get("/api/page/:pid",                                                    pageController.getPageById.bind(pageController)); 
        application.post("/api/page",                           AuthMiddleware.getVerified(),pageController.addPage.bind(pageController));
        application.put("/api/page/:pid",                       AuthMiddleware.getVerified(),pageController.editPage.bind(pageController));
        application.delete("/api/page/:pid",                    AuthMiddleware.getVerified(),pageController.deletePage.bind(pageController));
        application.post("/api/page/:pid/photo",                AuthMiddleware.getVerified(),pageController.uploadPhoto.bind(pageController));
           
        
    }

}
export default PageRouter;