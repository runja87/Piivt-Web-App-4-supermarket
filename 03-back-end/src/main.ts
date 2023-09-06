import * as express from "express";
import * as cors from "cors";
import IConfig from "./common/IConfig.interface";
import DevConfig from "./configs";
import * as fs from "fs";
import fileUpload = require("express-fileupload");
import * as morgan from "morgan";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from 'mysql2/promise';
import AplicationRouters from "./routers";
import CategoryService from "./components/category/CategoryService.service";
import NewsService from "./components/news/NewsService.service";
import AdministratorService from "./components/administrator/AdministratorService.service";
import ProductService from "./components/product/ProductService.service";
import PhotoService from "./components/photo/PhotoService.service";
import PageService from "./components/page/PageService.service";
import ContactService from "./components/contact/ContactService.service";


const application: express.Application = express();
const config: IConfig = DevConfig;

async function main() {

    fs.mkdirSync(config.logging.path, {
        mode: 777,
        recursive: true,
    });

    application.use(morgan(config.logging.format, {
        stream: fs.createWriteStream(config.logging.path + "/" + config.logging.filename, { flags: 'a' }),
    }));

    const db = await mysql2.createConnection({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        charset: config.database.charset,
        timezone: config.database.timezone,
        supportBigNumbers: config.database.supportBigNumbers,

    });

    const applicationResources: IApplicationResources = {
        databaseConnection: db,
        services: {
            category: null,
            news: null,
            product: null,
            photo: null,
            page: null,
            contact: null,
            administrator: null,

        }
    };
        applicationResources.services.category = new CategoryService(applicationResources);
        applicationResources.services.news = new NewsService(applicationResources);
        applicationResources.services.administrator = new AdministratorService(applicationResources);
        applicationResources.services.product = new ProductService(applicationResources);
        applicationResources.services.photo = new PhotoService(applicationResources);
        applicationResources.services.page = new PageService(applicationResources);
        applicationResources.services.contact = new ContactService(applicationResources);
        
       

    application.use(cors());
    application.use(express.json());

    application.use(express.urlencoded({extended: true})),
    application.use(fileUpload({
        limits: {
            files: 5,
            fileSize: 1024 * 1024 * 5,
        },
        abortOnLimit: true,
        useTempFiles: true,
        tempFileDir: "../temp/",
        createParentPath: true,
        safeFileNames: true,
        preserveExtension: true,


    }));



    application.use(config.server.static.route, express.static(config.server.static.path, {
        index: config.server.static.index,
        cacheControl: config.server.static.cacheControl,
        maxAge: config.server.static.maxAge,
        etag: config.server.static.etag,
        dotfiles: config.server.static.dotfiles
    }));
    for (const router of AplicationRouters) {
        router.setupRoutes(application, applicationResources);
    }

    application.use((req, res) => {
        res.sendStatus(404);
    });

    application.listen(config.server.port);
}

process.on('uncaughtException', error => {
    console.error('ERROR', error);
})
main();

