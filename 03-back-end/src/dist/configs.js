"use strict";
exports.__esModule = true;
var DevConfig = {
    server: {
        port: 10000,
        static: {
            route: "/assets",
            path: "./static",
            cacheControl: true,
            dotfiles: "deny",
            etag: true,
            index: false,
            maxAge: 36000
        }
    },
    logging: {
        path: "./logs",
        filename: "access.log",
        format: ":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-lenght] bytes\t:response-time ms"
    },
    database: {
        host: "localhost",
        port: 3306,
        user: "aplikacija",
        password: "aplikacija",
        database: "piivt_app",
        charset: "utf8",
        timezone: "+01:00",
        supportBigNumbers: true
    }
};
exports["default"] = DevConfig;
