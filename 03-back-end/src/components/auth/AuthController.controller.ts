import { Request, Response } from "express-serve-static-core";
import BaseController from "../../common/BaseController";
import { IAdministratorLoginDto } from "./dto/IAdministratorLogin.dto";
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import IAdministratorTokenData from "./dto/IAdministratorTokenData.dto";
import DevConfig from "../../configs";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { delay } from "../../helpers/Utils";



const activeRefreshTokens = new Set<string>();
export default class AuthController extends BaseController {

  public async administratorLogin(req: Request, res: Response) {
    try {
      const data = req.body as IAdministratorLoginDto;

      const result = await this.services.administrator.getByUsername(data.username);
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "Administrator account not found!" });
      }

      const administrator = result[0];

      if (!bcrypt.compareSync(data.password, administrator.passwordHash)) {
        return res.status(401).json({ message: "Wrong username or password!" });
      }

      const tokenData: IAdministratorTokenData = {
        administratorId: administrator.administratorId,
        username: administrator.username,
      };

      const nowSec = Math.floor(Date.now() / 1000);

      const authToken = jwt.sign(
        { ...tokenData, tokenType: "auth", iat: nowSec },
        DevConfig.auth.administrator.tokens.auth.keys.private,
        {
          algorithm: DevConfig.auth.administrator.algorithm,
          issuer: DevConfig.auth.administrator.issuer,
          expiresIn: DevConfig.auth.administrator.tokens.auth.duration, // seconds
        }
      );

      const refreshToken = jwt.sign(
        { ...tokenData, tokenType: "refresh", iat: nowSec },
        DevConfig.auth.administrator.tokens.refresh.keys.private,
        {
          algorithm: DevConfig.auth.administrator.algorithm,
          issuer: DevConfig.auth.administrator.issuer,
          expiresIn: DevConfig.auth.administrator.tokens.refresh.duration, // seconds
        }
      );

      return res.json({
        authToken,
        refreshToken,
        id: administrator.administratorId,

      });
    } catch (error) {
      await delay(1500);
      return res.status((error as any)?.status ?? 500).json({
        message: (error as any)?.message ?? "Unexpected error.",
      });
    }
  }



  administratorRefresh = async (req: Request, res: Response) => {
    const authz = req.headers.authorization ?? "";
    const refreshTokenRaw = authz.replace(/^Bearer\s+/i, "").trim();

    if (!refreshTokenRaw) {
      return res.status(401).json({ message: "Missing refresh token." });
    }


    if (activeRefreshTokens.has(refreshTokenRaw)) {
      return res.status(429).json({ message: "Refresh request already in progress." });
    }
    activeRefreshTokens.add(refreshTokenRaw);

    try {
      const payload = jwt.verify(
        refreshTokenRaw,
        DevConfig.auth.administrator.tokens.refresh.keys.public,
        {
          algorithms: [DevConfig.auth.administrator.algorithm],
          issuer: DevConfig.auth.administrator.issuer,
        }
      ) as jwt.JwtPayload;



      if (payload?.tokenType !== "refresh") {
        return res.status(401).json({ message: "Invalid token type for refresh." });
      }

      const tokenData: IAdministratorTokenData = {
        administratorId: Number(payload.administratorId),
        username: String(payload.username),
      };

      const nowSec = Math.floor(Date.now() / 1000);

      const authToken = jwt.sign(
        { ...tokenData, tokenType: "auth", iat: nowSec },
        DevConfig.auth.administrator.tokens.auth.keys.private,
        {
          algorithm: DevConfig.auth.administrator.algorithm,
          issuer: DevConfig.auth.administrator.issuer,
          expiresIn: DevConfig.auth.administrator.tokens.auth.duration,
        }
      );

      const newRefreshToken = jwt.sign(
        { ...tokenData, tokenType: "refresh", iat: nowSec },
        DevConfig.auth.administrator.tokens.refresh.keys.private,
        {
          algorithm: DevConfig.auth.administrator.algorithm,
          issuer: DevConfig.auth.administrator.issuer,
          expiresIn: DevConfig.auth.administrator.tokens.refresh.duration,
        }
      );

      return res.json({
        authToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return res.status((error as any)?.status ?? 401).json({
        message: (error as any)?.message ?? "Invalid or expired refresh token.",
      });
    } finally {
      activeRefreshTokens.delete(refreshTokenRaw);
    }
  };


}


