import IModel from "../../common/IModel.interface";

export class AdministratorModel implements IModel {

    administratorId: number;
    username: string;
    email: string;
    passwordHash: string;
    passwordResetLink: string | null;
    passwordResetCode: string | null;
    createdAt: string;
    isActive: boolean;


}