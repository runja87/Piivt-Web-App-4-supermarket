import IAdministratorTokenData from '../../src/components/auth/dto/IAdministratorTokenData.dto';

declare global {
    namespace Express {
        interface Request {
            authorisation?: IAdministratorTokenData | null;
        }
    }
}