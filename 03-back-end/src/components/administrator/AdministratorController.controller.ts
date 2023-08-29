import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import * as bcrypt from "bcrypt";
import IAddAdministratorDto, { AddAdministratorValidator } from "./dto/IAddAdministrator.dto";

export default class AdministratorController extends BaseController {

    getAll(req: Request, res: Response) {
        this.services.administrator.getAll({removePassword:true})
            .then(result => {
               res.send(result);
            })
            .catch(error => {
               res.status(500).send(error?.message);
            })
    }


       getById(req: Request, res: Response){
        const id: number = +req.params?.id;
        this.services.administrator.getById(id, {removePassword: true})
        .then(result =>{
            if(result === null){
               return res.status(404).send('Administrator not found!');
            }
           res.send(result);

        })
        .catch(error => {
            res.status(500).send(error?.message);
        })
      
      
    }

    add(req: Request, res: Response) {
        const body = req.body as IAddAdministratorDto;
        if (!AddAdministratorValidator(body)) {
           return res.status(400).send(AddAdministratorValidator.errors);
        }

        
        const passwordHash = bcrypt.hashSync(body.password_hash, 10);
        this.services.administrator.add({username: body.username, email: body.email, password_hash: passwordHash}, {removePassword: false})
        .then(result => {
            res.send(result);
        })
        .catch(error => {
           res.status(500).send(error?.message);
        })

    }


}