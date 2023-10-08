import { toASCII } from "punycode";
import IConfig from "./common/IConfig.interface";
import { MailConfigurationParametars } from "./config.mail";
import { readFileSync } from "fs";

const DevConfig: IConfig = {
    server: {
        port: 10000,
        static: {
            route: "/assets",
            path: "./static",
            cacheControl: true,
            dotfiles: "deny",
            etag: true,
            index: false,
            maxAge: 36000,
        },
    },
    logging: {
        path: "./logs",
        filename: "access.log",
        format: ":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-lenght] bytes\t:response-time ms",
    },
    database: {
        host: "localhost",
        port: 3306,
        user: "aplikacija",
        password: "aplikacija",
        database: "piivt_app",
        charset: "utf8",
        timezone: "+01:00",
        supportBigNumbers: true,
    },
    fileUploads: {
        maxFiles: 5,
        maxFileSize: 5 * 1024 * 1024, //5Mb
        tempFileDirectory: "../temp/",
        destinationDirectoryRoot: "uploads/",
        photos: {
            allowedTypes: ["png", "jpg"],
            allowedExtensions: [".png",".jpg"],
            width: {
                min: 320,
                max: 1920,
            },
            height: {
                min: 240,
                max: 1080,
            },
            resize: [
                {
                    prefix: "small-",
                    width: 320,
                    height: 240,
                    fit: "cover",
                    defaultBackground: {r: 0, g: 0, b: 0, alpha: 1, }
                },
                {
                    prefix: "medium-",
                    width: 640,
                    height: 480,
                    fit: "cover",
                    defaultBackground: {r: 0, g: 0, b: 0, alpha: 1, }
                },

            ]
        }
    },
    mail: {
        service: "Outlook365",
        pool: true,
        port: 587,
        requireTLS: true,
        secure: true,
        logger: true,
        debug: true, 
        secureConnection: false,   
        tls: {
          ciphers:'TLSv1.3',
          rejectUnauthorized: true,
        },
        auth: {
            email: 'nenad.mirazic.15@singimail.rs',
            pass: '*************',
        }
    },
   
    auth: {
        administrator: {
            algorithm: "RS256",
            issuer: "Piivt",
            tokens: {
                auth: {
                    duration: 60 * 60 * 24, // For dev 24h, otherwise couple min.
                    keys: {
                        public: readFileSync("./.keystore/app.public","ascii"),
                        private: readFileSync("./.keystore/app.private","ascii"),
                    },
                },
                refresh: {
                    duration: 60 * 60 * 24, // For dev 60 days, otherwise around month.
                    keys: {
                        public: readFileSync("./.keystore/app.public","ascii"),
                        private: readFileSync("./.keystore/app.private","ascii"),
                    },
                },
            }
        }
    }
 
};
DevConfig.mail = MailConfigurationParametars;

export default DevConfig;