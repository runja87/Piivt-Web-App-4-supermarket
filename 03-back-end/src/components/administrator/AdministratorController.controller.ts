import { Request, Response } from "express";
import * as express from 'express';
import BaseController from "../../common/BaseController";
import * as bcrypt from "bcrypt";
import IAddAdministratorDto, { AddAdministratorValidator } from "./dto/IAddAdministrator.dto";
import IEditAdministrator, { EditAdministratorValidator, IEditAdministratorDto } from "./dto/IEditAdministrator.dto";
import { AdministratorModel } from "./AdministratorModel.model";
import DevConfig from "../../configs";
import * as nodemailer from "nodemailer";
import * as Mailer from "nodemailer/lib/mailer";
import * as uuid from 'uuid';
import { IRequestResetPasswordDto, RequestResetPasswordValidator } from "./dto/IRequestResetPassword.dto";
import { IResetPasswordDto, ResetPasswordValidator } from "./dto/IResetPassword.dto";
import IAddAdministrator from "./dto/IAddAdministrator.dto";
import IConfig from "../../common/IConfig.interface";

const config: IConfig = DevConfig;
const app = express();
app.use(express.json());
export default class AdministratorController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.administrator
      .getAll({ removePassword: true, removePasswordResetCode: true })
      .then((result) => {
        return res.send(result);
      })
      .catch((error) => {
        return res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.aid;

    this.services.administrator
      .getById(id, { removePassword: true, removePasswordResetCode: true })
      .then((result) => {
        if (result === null || !result.isActive) {
          return res.status(404).send("Administrator not found or disabed!");
        }
        return res.send(result);
      })
      .catch((error) => {
        return res.status(500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const data = req.body as IAddAdministratorDto;
    if (!AddAdministratorValidator(data)) {
      return res.status(400).send(AddAdministratorValidator.errors);
    }
    const passwordHash = bcrypt.hashSync((data as any).password, 10);
    const serviceData: IAddAdministrator = {
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
    };

    this.services.administrator
      .add(serviceData, {
        removePassword: false,
        removePasswordResetCode: true,
      })
      .then((result) => {
        return res.send(result);
      })
      .catch((error) => {
        if (error?.code === 'ER_DUP_ENTRY') {
          return res.status(409).send({
            message: "Duplicate entry for administrator.",
            data: { error },
          });
        }
        console.error(error);
        return res.status(500).send({
          message: "An error occurred while adding the administrator.",
          data: { error },
        });
      });
  }

  async editById(req: Request, res: Response) {
    const administrator: AdministratorModel = new AdministratorModel();
    const id: number = +req.params?.aid;
    const body = req.body as IEditAdministratorDto;
    const isAuthorizedToUpdate = administrator.administratorId == id;
    const isAdminAction =
      body.username !== undefined ||
      body.password !== undefined ||
      body.email !== undefined;



    if (!EditAdministratorValidator(body)) {
      return res.status(400).send(EditAdministratorValidator.errors);
    }

    if (isAdminAction && !isAuthorizedToUpdate) {
      return res
        .status(403)
        .send("You are not authorized to perform this action!");
    }

    const serviceData: IEditAdministrator = {};
    try {
      if (body.password !== undefined && isAuthorizedToUpdate) {
        const passwordHash = await bcrypt.hash(body.password, 10);
        serviceData.password_hash = passwordHash;
      }

      if (body.isActive !== undefined) {
        serviceData.is_active = +(body.isActive ? true : false);
      }

      if (isAuthorizedToUpdate) {
        if (body.username !== undefined) {
          serviceData.username = body.username;
        }
        if (body.email !== undefined) {
          serviceData.email = body.email;
        }
      }
      await this.services.administrator
        .edit(id, serviceData, {
          removePassword: true,
          removePasswordResetCode: true,
        })
        .then((result) => {
          return res.send(result);

        })
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        return res.status(409).send({
          message: "Duplicate entry for administrator.",
          data: { error },
        });
      }

      return res.status(500).send({
        message: "An error occurred while updating the administrator.",
        data: { error },
      });
    }
  }



  resetPassword(req: Request, res: Response) {
    const body = req.body as IResetPasswordDto;
    const code = req.params.code as string;

    if (!ResetPasswordValidator(body)) {
      return res.status(400).send(ResetPasswordValidator.errors);
    }
    this.services.administrator
      .getByPasswordResetCode(code)
      .then((result) => {
        if (!result || result.length === 0) {
          throw {
            status: 404,
            message: "Password reset token not valid!!",
          };
        }
        return result;
      })
      .then((result) => {
        const admin = result[0];
        const tokenCreatedAt = new Date(admin.createdAt);
        const now = new Date();
        if (now.getTime() > tokenCreatedAt.getTime() + 5 * 60 * 1000) {
          throw {
            status: 400,
            message: "Password reset token has expired. Please request a new reset link.",
          };
        }
        if (body.password1 === body.password2) {
          const password = body.password2 as string;
          const passwordHash = bcrypt.hashSync(password, 10);
          const serviceData: IEditAdministrator = {
            password_hash: passwordHash,
          };
          this.services.administrator.edit(admin.administratorId, serviceData, {
            removePassword: true,
            removePasswordResetCode: true,
          });
          result[0].passwordResetCode = null;
          return res.status(200).send("Password successfully changed!");
        } else {
          return res.status(400).send("Passwords don't match!");
        }
      })

      .catch((error) => {
        setTimeout(() => {
          return res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  requestResetPassword(req: Request, res: Response) {
    const body = req.body as IRequestResetPasswordDto;

    if (!RequestResetPasswordValidator(body)) {
      return res.status(400).send({
        message: "Invalid email format. Please provide a valid email address.",
      });
    }

    this.services.administrator
      .getByEmail(body.email)
      .then((result) => {
        if (!Array.isArray(result) || result.length === 0) {
          throw {
            status: 404,
            message: "Admin account for provided email address does not exist.",
          };
        }
        const passwordResetLink = `${config.server.frontend.host}:${config.server.frontend.port}/auth/password-reset/`;
        const passwordResetCode =  `${uuid.v4()}.${Date.now() + 5 * 60 * 1000}`;
        const serviceData: IEditAdministrator = {
          password_reset_link: passwordResetLink,
          password_reset_code: passwordResetCode,
        };

        return this.services.administrator
          .edit(result[0].administratorId, serviceData, {
            removePassword: true,
            removePasswordResetCode: false,
          })
          .then(() => {
            return this.services.administrator.getById(result[0].administratorId, {
              removePassword: true,
              removePasswordResetCode: false,
            });
          });
      })
      .then((updatedAdmin) => {
        if (!updatedAdmin || !updatedAdmin.passwordResetLink || !updatedAdmin.passwordResetCode) {
          throw new Error("Failed to generate a valid password reset link or code.");
        }
        return this.sendPasswordResetEmail(res, updatedAdmin);
      })
      .catch((error) => {
        console.error(error);

        if (error?.status && error?.message) {
          return res.status(error.status).send({ message: error.message });
        }

        return res.status(500).send({
          message: error?.message || "An unexpected error occurred.",
        });
      });
  }


  private async sendPasswordResetEmail(
    res: Response,
    administrator: AdministratorModel
  ) {
    return new Promise((reject) => {
      const transport = nodemailer.createTransport({
        from: administrator.email,
        service: DevConfig.mail.service,
        auth: {
          user: DevConfig.mail.auth.email,
          pass: DevConfig.mail.auth.pass,
        },
      });
      if (!administrator.passwordResetLink || !administrator.passwordResetCode) {
        throw new Error("Password reset link or code is missing!");
      }
      const resetLink = `http://${administrator.passwordResetLink}${administrator.passwordResetCode}`;
      const unsubscribeLink = `http://${administrator.passwordResetLink}Unsubscribe`;
      const mailOptions: Mailer.Options = {
        to: administrator.email,
        subject: "Passwort reset link",
        html: `<!doctype html>
            <html>
            <head> <meta charset = "utf-8"></head>
            <body>
            <p>
            Dear ${administrator.username}, <br>
            <br>
            Click on the following link to reset your password:
             <a href="${resetLink}">Reset password</a>
             <p>Pasword reset link is valid for next 5 minutes!</p>
            </p>
            <p>
            <a href= "${unsubscribeLink}">Unsubscribe</a>
            </p>
            
            </body>
            </html>`,
      };
      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();
          res.status(200).send("Password reset link sent!");
        })
        .catch((error) => {
          transport.close();
          reject({
            message: error?.message,
          });
        });
    });
  }
}


