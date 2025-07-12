import { Request, Response } from "express-serve-static-core";
import BaseController from "../../common/BaseController";
import { IAdministratorLoginDto } from "./dto/IAdministratorLogin.dto";
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import IAdministratorTokenData from "./dto/IAdministratorTokenData.dto";
import DevConfig from "../../configs";
import AuthMiddleware from "../../middlewares/AuthMiddleware";

const activeRefreshTokens = new Set<string>();
export default class AuthController extends BaseController {

    public async administratorLogin(req: Request, res: Response){
        const data = req.body as IAdministratorLoginDto;

        this.services.administrator.getByUsername(data.username)
        .then(result => {
            if(result === null){
                throw {
                    status: 404,
                    message: "Administrator account not found!"
                };
            }
            return result[0];
        })
        .then(administrator => {
            if(!bcrypt.compareSync(data.password, administrator.passwordHash)){
                throw {
                    status: 404,
                    message: "Wrong username or password!"
                };
            }
            return administrator;

            })
            .then(administrator => {
                const tokenData: IAdministratorTokenData = {
                    administratorId: administrator.administratorId,
                    username: administrator.username,
                };
                
            const authToken = jwt.sign({...tokenData, tokenType: "auth", iat: Math.floor(Date.now() / 1000),}, DevConfig.auth.administrator.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.administrator.algorithm,
                issuer: DevConfig.auth.administrator.issuer,
                expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
            });
            const refreshToken = jwt.sign({ ...tokenData, tokenType: "refresh", iat: Math.floor(Date.now() / 1000),}, DevConfig.auth.administrator.tokens.refresh.keys.private, {
                algorithm: DevConfig.auth.administrator.algorithm,
                issuer: DevConfig.auth.administrator.issuer,
                expiresIn: DevConfig.auth.administrator.tokens.refresh.duration,
            });

                res.send({
                    authToken: authToken,
                    refreshToken: refreshToken,
                    id: administrator.administratorId,
                });
            })
            .catch(error =>{
                setTimeout(() => {
                    res.status(error?.status ?? 500).send(error?.message);
                }, 1500);
                
            });

        }

      

        administratorRefresh(req: Request, res: Response) {
            const refreshTokenHeader: string = req.headers?.authorization ?? "";             
            if (activeRefreshTokens.has(refreshTokenHeader)) {
                return res.status(429).send("Refresh request already in progress.");
            }
            activeRefreshTokens.add(refreshTokenHeader);
        
            try {
                const validateTokenData = AuthMiddleware.validateTokenAs(refreshTokenHeader, "refresh");
        
                const tokenData: IAdministratorTokenData = {
                    administratorId: validateTokenData.administratorId,
                    username: validateTokenData.username,
                };
        
                const authToken = jwt.sign(
                    { ...tokenData, tokenType: "auth" },
                    DevConfig.auth.administrator.tokens.auth.keys.private,
                    {
                        algorithm: DevConfig.auth.administrator.algorithm,
                        issuer: DevConfig.auth.administrator.issuer,
                        expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
                    }
                );
        
                res.send({ authToken });
        
            } catch (error) {
                res.status(error?.status ?? 500).send(error?.message);
            } finally {
                activeRefreshTokens.delete(refreshTokenHeader);
            }
        }
        
    }


