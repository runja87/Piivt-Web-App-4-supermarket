import IModel from "../../common/IModel.interface";

export class AdministratorModel implements IModel {

    administratorId: number;
    username: string;
    email: string;
    passwordHash: string;
    passwordResetLink?: string;
    passwordResetCode?: string;
    createdAt: string;
    isActive: boolean;


}