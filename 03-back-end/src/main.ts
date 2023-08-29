import * as express from "express";
import * as cors from "cors";
import IConfig from "./common/IConfig.interface";
import DevConfig from "./configs";
import * as fs from "fs";
import * as morgan from "morgan";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from 'mysql2/promise';
import AplicationRouters from "./routers";
import CategoryService from "./components/category/CategoryService.service";
import NewsService from "./components/news/NewsService.service";
import AdministratorService from "./components/administrator/AdministratorService.service";

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
            category: new CategoryService(db),
            news: new NewsService(db),
            administrator: new AdministratorService(db),
        }

    };


    application.use(cors());
    application.use(express.json());

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