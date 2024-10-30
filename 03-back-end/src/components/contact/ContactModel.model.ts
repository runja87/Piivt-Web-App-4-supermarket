import IModel from '../../common/IModel.interface';




class ContacttModel implements IModel {
    messageId: number;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    message: string;
    createdAt: string;

}

export default ContacttModel;