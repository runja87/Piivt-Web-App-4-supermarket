import { Request, Response } from "express";
import * as express from 'express';
import BaseController from "../../common/BaseController";
import * as bcrypt from "bcrypt";
import IAddAdministratorDto, { AddAdministratorValidator } from "./dto/IAddAdministrator.dto";
import IEditAdministrator, { EditAdministratorValidator, IEditAdministratorDto } from "./dto/IEditAdministrator.dto";



const app = express();
app.use(express.json());
export default class AdministratorController extends BaseController {



    getAll(req: Request, res: Response) {
        this.services.administrator.getAll({ removePassword: true })
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            })
    }


    getById(req: Request, res: Response) {
        const id: number = +req.params?.id;
        this.services.administrator.getById(id, { removePassword: true })
            .then(result => {
                if (result === null) {
                    return res.status(404).send('Administrator not found!');
                }
                res.send(result);

            })
            .catch(error => {
                res.status(500).send(error?.message);
            })


    }

    add(req: Request, res: Response) {
        const data = req.body as IAddAdministratorDto;
        if (!AddAdministratorValidator(data)) {
            return res.status(400).send(AddAdministratorValidator.errors);
        }


        const passwordHash = bcrypt.hashSync(data.password_hash, 10);
        this.services.administrator.add({ username: data.username, email: data.email, password_hash: passwordHash }, { removePassword: false })
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            })

    }

    editById(req: Request, res: Response) {
        const id: number = +req.params?.aid;
        const body = req.body as IEditAdministratorDto;
        if (!EditAdministratorValidator(body)) {
            return res.status(400).send(EditAdministratorValidator.errors);
        }

        const passwordHash = bcrypt.hashSync(body.password, 10);

        const serviceData: IEditAdministrator = { username: body.username, email: body.email, is_active: +body.isActive, password_hash: passwordHash };
        if (body.isActive !== undefined) {
            serviceData.is_active = body.isActive ? 1 : 0;
        }
        this.services.administrator.edit(id, serviceData, { removePassword: true })
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            })

    }


}