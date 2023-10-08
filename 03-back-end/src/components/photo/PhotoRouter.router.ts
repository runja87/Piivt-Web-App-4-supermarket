import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import PhotoController from "./PhotoController.controller";


class PhotoRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const photoController: PhotoController = new PhotoController(resources.services);

        application.get("/api/photo",                            photoController.getAllPhotos.bind(photoController));
        application.put("/api/photo/:pid",                       photoController.editPhoto.bind(photoController)); 
        application.post("/api/page",                           photoController.uploadPhoto.bind(photoController));
        application.delete("/api/photo/:pid",                    photoController.deletePhoto.bind(photoController));
     
           
        
    }

}
export default PhotoRouter;