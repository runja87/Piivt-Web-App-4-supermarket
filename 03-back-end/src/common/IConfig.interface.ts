import { Algorithm } from "jsonwebtoken"


export interface IResize {
    
        prefix: string,
        width: number,
        height: number,
        fit: "contain" | "cover",
        defaultBackground: {
            r: number,
            g: number,
            b: number,
            alpha: number,
        },
    
}
export interface IMailConfiguration {
    
    service: string,
    auth: {
        email: string,
        pass: string
    }

}
export interface ITokenProperties{
       duration: number,
       keys: {
        public: string,
        private: string,
       }
}

export interface IAuthTokenOptions {
    issuer: string,
    algorithm: Algorithm,
    tokens: {
        auth: ITokenProperties,
        refresh: ITokenProperties,
    },
}
export default interface IConfig {

server: {
    backend: {
        host: string,
        port: number,
        static: {
            path: string,
            route: string,
            cacheControl: boolean,
            dotfiles: "deny" | "allow",
            etag: boolean,
            index: string | false,
            maxAge: number
    
        }
    },
    frontend: {
        host: string,
        port: number,
    }

},
logging: {
    path: string,
    filename: string,
    format: string,
},
database: {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
    charset: 'utf8' | 'utf8mb4' | 'ascii',
    timezone: '+01:00' | '+09:00'| '-07:00',
    supportBigNumbers: boolean,

},
fileUploads: {
    maxFiles: number,
    maxFileSize: number,
    tempFileDirectory: string,
    destinationDirectoryRoot: string,
    photos: {
        allowedTypes: string[],
        allowedExtensions: string [],
        width: {
            min: number,
            max: number,
        },
        height: {
            min: number,
            max: number,
        }
        resize: IResize[],
    },

},
mail: IMailConfiguration,
auth: {
    administrator: IAuthTokenOptions,
    allowAllRoutesWithoutAuthTokens: boolean,
}


};