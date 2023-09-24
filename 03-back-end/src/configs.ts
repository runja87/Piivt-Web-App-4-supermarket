import IConfig from "./common/IConfig.interface";

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
    }
 
}

export default DevConfig;