import { send } from "process";
import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import { AdministratorModel } from "./AdministratorModel.model";
import IAddAdministrator from './dto/IAddAdministrator.dto';
import IEditAdministrator from './dto/IEditAdministrator.dto';
import { resolve } from "path";
import { error } from "console";

export class IAdministratorAdapterOptions implements IAdapterOptions { 
        removePassword: boolean;
        removePasswordResetCode: boolean;
}
export const DefaultAdministratorOptions: IAdministratorAdapterOptions = {
        removePassword: false,
        removePasswordResetCode: false,
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
                administrator.passwordResetCode = data?.password_reset_code;
                administrator.createdAt = data?.created_at;
                administrator.isActive = Boolean(data?.is_active);
                if(options.removePassword){
                        administrator.passwordHash = null;
                }
                if(options.removePasswordResetCode){
                        administrator.passwordResetCode = null;
                }
                return administrator;   
        }


        public async add(data: IAddAdministrator, options: IAdministratorAdapterOptions): Promise<AdministratorModel> {
                return this.baseAdd(data, options);
        }

        public async edit(id: number, data: IEditAdministrator, options: IAdministratorAdapterOptions): Promise<AdministratorModel>{
                return this.baseEditById(id,data, options);
        }
        public async deactivateActivate(id: number):Promise<boolean> {
                return this.baseDeleteById(id);
        }
        public async getByEmail(value: string): Promise<AdministratorModel[]|null>{
                return this.baseGetAllByFieldNameAndValue("email", value,DefaultAdministratorOptions);
        }
        public async getByPasswordResetCode(value: string): Promise<AdministratorModel[]|null>{
                return new Promise ((resolve, reject) => {
                        this.baseGetAllByFieldNameAndValue("password_reset_code", value,DefaultAdministratorOptions)
                        .then(result => {
                                if(result.length === 0){
                                        return resolve(null);
                                }
                                resolve(result)
                        })
                        .catch(error => {
                                reject(error);
                        });
                });

        }
        public async getByUsername(username: string): Promise<AdministratorModel[]|null> {
                return new Promise ((resolve, reject) => {
                        this.baseGetAllByFieldNameAndValue("username", username, {removePassword: false, removePasswordResetCode: true})
                        .then(result => {
                                if(result.length === 0){
                                        return resolve(null);
                                }
                                resolve(result)
                        })
                        .catch(error => {
                                reject(error);
                        });
                });
            

           
        }



}


