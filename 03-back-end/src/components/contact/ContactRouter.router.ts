import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import ContactController from './ContactController.controller';
import AuthMiddleware from "../../middlewares/AuthMiddleware";



class ContactRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const contactController: ContactController = new ContactController(resources.services);

        application.get("/api/message",                            AuthMiddleware.getVerified(), contactController.getAllMessages.bind(contactController));
        application.post("/api/message",                                                         contactController.addMessage.bind(contactController));
        application.delete("/api/message/:mid",                    AuthMiddleware.getVerified(), contactController.deleteMessage.bind(contactController));
           
        
    }

}
export default ContactRouter;