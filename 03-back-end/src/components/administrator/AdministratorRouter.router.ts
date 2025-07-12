import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import AdministratorController from './AdministratorController.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';


class AdministratorRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const administratorControler: AdministratorController= new AdministratorController(resources.services);

        application.get("/api/administrator",            AuthMiddleware.getVerified(), administratorControler.getAll.bind(administratorControler));
        application.get("/api/administrator/:aid",       AuthMiddleware.getVerified(), administratorControler.getById.bind(administratorControler));
        application.post("/api/administrator",           AuthMiddleware.getVerified(), administratorControler.add.bind(administratorControler));
        application.post("/api/administrator/requestpasswordreset",                    administratorControler.requestResetPassword.bind(administratorControler));
        application.post("/api/administrator/resetpassword/:code",                     administratorControler.resetPassword.bind(administratorControler));
        application.put("/api/administrator/:aid",       AuthMiddleware.getVerified(), administratorControler.editById.bind(administratorControler));
    }

}
export default AdministratorRouter;