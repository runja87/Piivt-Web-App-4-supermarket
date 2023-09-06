import * as express from 'express';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from '../../common/IRouter.interface';
import ContactController from './ContactController.controller';



class ContactRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const contactController: ContactController = new ContactController(resources.services);

        application.get("/api/message",                            contactController.getAllMessages.bind(contactController));
        application.post("/api/message",                           contactController.addMessage.bind(contactController));
        application.delete("/api/message/:mid",                    contactController.deleteMessage.bind(contactController));
           
        
    }

}
export default ContactRouter;