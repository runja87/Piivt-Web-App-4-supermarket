import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import AdministratorController from './AdministratorController.controller';


class AdministratorRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const administratorControler: AdministratorController= new AdministratorController(resources.services);

        application.get("/api/administrator", administratorControler.getAll.bind(administratorControler));
        application.get("/api/administrator/:id", administratorControler.getById.bind(administratorControler));
        application.post("/api/administrator", administratorControler.add.bind(administratorControler));
    }

}
export default AdministratorRouter;