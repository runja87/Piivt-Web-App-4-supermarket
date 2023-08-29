import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import { AdministratorModel } from "./AdministratorModel.model";
import IAddAdministrator from './dto/IAddAdministrator.dto';

export class IAdministratorAdapterOptions implements IAdapterOptions { 
        removePassword: boolean;
}
export const DefaultAdministratorOptions: IAdministratorAdapterOptions = {
        removePassword:false,
}


export default class AdministratorService extends BaseService <AdministratorModel,IAdministratorAdapterOptions> {

        tableName(): string {
            return "administrator";
        }
    
        protected async adaptToModel(data: any, options: IAdministratorAdapterOptions = DefaultAdministratorOptions): Promise <AdministratorModel> {  
                const administrator: AdministratorModel = new AdministratorModel();
                administrator.administratorId = +data?.administrator_id;
                administrator.username = data?.username;
                administrator.email = data?.email;
                administrator.passwordHash = data?.password_hash;
                administrator.passwordResetLink = data?.password_reset_link;
                administrator.createdAt = data?.created_at;
                administrator.isActive = Boolean(data?.is_active);
                if(options.removePassword){
                        administrator.passwordHash = null;
                }
                return administrator;   
        }


        public async add(data: IAddAdministrator, options: IAdministratorAdapterOptions): Promise<AdministratorModel> {
                return this.baseAdd(data, options);
        }












}