import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import ContactModel from "./ContactModel.model";
import ISendMessage from "./dto/ISendMessage.dto";







class IContactAdapterOptions implements IAdapterOptions { }

class ContactService extends BaseService<ContactModel, IContactAdapterOptions> {
    tableName(): string {
        return "contact";
    }

    protected async adaptToModel(data: any): Promise<ContactModel> {
        const contact: ContactModel = new ContactModel();
        contact.messageId = data.contact_id;
        contact.firstName = data.firstname;
        contact.lastName= data.lastname;
        contact.title = data.title;
        contact.email = data.email;
        contact.createdAt = data.created_at;
        contact.message = data.message;
        return contact;
    }

    
    public async add(data: ISendMessage): Promise<ContactModel> {
        return this.baseAdd(data, {});
    }


    public async deleteById(pageId: number): Promise<boolean> {
        return this.baseDeleteById(pageId);
    }
}

export default ContactService;