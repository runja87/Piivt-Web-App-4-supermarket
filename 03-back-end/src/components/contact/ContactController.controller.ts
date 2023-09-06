import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
import { ISendMessageDto, SendMessageValidator } from "./dto/ISendMessage.dto";


class ContactController extends BaseController {

    async getAllMessages(req: Request, res: Response) {
      this.services.contact.getAll(DefaultCategoryAdapterOptions)
      .then(result => {
        if (result.length === 0) {
          return res.status(404).send('They arent any messages sent or they have been deleted!');
        }
        else {
          return res.send(result);
        }

      })
       
    }



      

    async addMessage(req: Request, res: Response) {
        const data: ISendMessageDto = req.body;
        if (!SendMessageValidator(data)) {
          return res.status(400).send(SendMessageValidator.errors);
        }    
        
          this.services.contact.add({ firstname: data.firstName, lastname: data.lastName, email: data.email, title: data.title, message: data.message})
          .then(result => {
           return res.send(result);
          })
          .catch(error => {

            return res.status(500).send(error?.message);
          });
    
      }
    
      
    
      async deleteMessage(req: Request, res: Response) {
        const messageId: number = +req.params?.mid;
        this.services.page.getById(messageId, DefaultCategoryAdapterOptions)
          .then(result => {
            if (result === null) {
              return res.status(404).send('Message could not be found or has been deleted!');
            }
            this.services.contact.deleteById(messageId)
              .then(result => {
                return res.send('This message has been deleted!');
              })
              .catch(error => {
                return res.status(500).send(error?.message);
              })
    
          })
          .catch(error => {
            return res.status(500).send(error?.message);
          });
      }
    

}
export default ContactController;