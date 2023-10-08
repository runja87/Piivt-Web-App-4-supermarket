import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import IAdministratorTokenData from "../components/auth/dto/IAdministratorTokenData.dto";
import DevConfig from "../configs";


export default class AuthMiddleware {
    public static getVerified():(req: Request, res: Response, next: NextFunction)=> void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.verifyAuthToken(req,res,next);
        }
    }
    private static verifyAuthToken(req: Request, res: Response, next: NextFunction){
        const tokenHeader: string = req.headers?.authorization ?? "";
        try {
           const check = this.validateTokenAs(tokenHeader, "auth");
        if (check === null){
            throw{
                status: 403,
                message: "You are not authorised to access this resource!",
            }
        }
        
       const checkIAdmin: IAdministratorTokenData = {
        administratorId: check.administratorId,
        username: check.username,

        }
        
        
        req.authorisation = checkIAdmin;

        next();

        }catch(error){
            res.status(error?.status ?? 500).send(error?.message);
        }

    }


    public static validateTokenAs(tokenString: string, type: "auth" | "refresh"): IAdministratorTokenData | null{
        if(tokenString === ""){
            throw{
                status: 400,
                message: "No token specified!",
            };
            
        }
        const [ tokenType, token] = tokenString.trim().split(" ");

        if(tokenType !== "Bearer") {
            throw{
                status: 401,
                message: "Invalid token type!",
            };
            
        }

        if(typeof token !== "string" || token.length === 0){
            throw{
                status: 401,
                message: "Token not specified!",
            };
        }
        try{
            const tokenVerification = jwt.verify(token, DevConfig.auth.administrator.tokens[type].keys.public);
            if (!tokenVerification){
                throw{
                    status: 401,
                    message: "Invalid token specified!",
                };
            }
            const tokenData = tokenVerification as IAdministratorTokenData; 

           
            return tokenData;

        }catch(error){
            const message: string = (error?.message ?? "");
            if(message.includes("jwt expired")){
                throw{
                    status: 401,
                    message: "This token has expired!",
                };
            }
            throw{
                status: 500,
                message: error?.message,
            };
        } 
    }

}