import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import PhotoController from "./PhotoController.controller";
import AuthMiddleware from '../../middlewares/AuthMiddleware';


class PhotoRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const photoController: PhotoController = new PhotoController(resources.services);

        application.get("/api/photos",                                                          photoController.getAllPhotos.bind(photoController));
        application.put("/api/photo/:pid",                       AuthMiddleware.getVerified(), photoController.editPhoto.bind(photoController)); 
        application.post("/api/photo",                            AuthMiddleware.getVerified(), photoController.uploadPhoto.bind(photoController));
        application.delete("/api/photo/:pid",                    AuthMiddleware.getVerified(), photoController.deletePhoto.bind(photoController));
     
           
        
    }

}
export default PhotoRouter;