import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import IAdministratorTokenData from "../components/auth/dto/IAdministratorTokenData.dto";
import DevConfig from "../configs";

type TokenKind = "auth" | "refresh";

export default class AuthMiddleware {
  public static getVerified() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (DevConfig.auth.allowAllRoutesWithoutAuthTokens) return next();

      try {
        const header = req.headers?.authorization ?? "";
        const payload = this.validateTokenAs(header, "auth");

        const adminData: IAdministratorTokenData = {
          administratorId: Number(payload.administratorId),
          username: String(payload.username),
        };

        (req as any).authorization = adminData;

        return next();
      } catch (err: any) {
        const status = Number(err?.status) || 401;
        const message = err?.message || "Unauthorized";
        return res.status(status).send(message);
      }
    };
  }


  public static validateTokenAs(
    tokenInput: string,
    kind: TokenKind
  ): IAdministratorTokenData & jwt.JwtPayload {
    if (!tokenInput || typeof tokenInput !== "string") {
      throw { status: 401, message: "No token specified." };
    }

    let token = tokenInput.trim();
    const parts = token.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    } else if (/^Bearer$/i.test(parts[0]) && !parts[1]) {
      throw { status: 401, message: "Token not specified." };
    }

    if (!token) {
      throw { status: 401, message: "Token not specified." };
    }

    try {
      const payload = jwt.verify(
        token,
        DevConfig.auth.administrator.tokens[kind].keys.public,
        {
          algorithms: [DevConfig.auth.administrator.algorithm],
          issuer: DevConfig.auth.administrator.issuer,
        }
      ) as IAdministratorTokenData & jwt.JwtPayload;


      if (!payload || payload.tokenType !== kind) {
        throw { status: 401, message: "Invalid token type." };
      }


      if (
        typeof payload.administratorId === "undefined" ||
        typeof payload.username === "undefined"
      ) {
        throw { status: 401, message: "Invalid token payload." };
      }

      return payload;
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.includes("jwt expired")) {
        throw { status: 401, message: "This token has expired." };
      }

      throw { status: 401, message: "Invalid token." };
    }
  }
}
