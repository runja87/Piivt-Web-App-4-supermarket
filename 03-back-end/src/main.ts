import * as express from "express";
import * as cors from "cors";
import Config from "./config/dev";
import { constants } from "buffer";
import CategoryController from './components/category/controller';
import CategoryService from "./components/category/service";

const application: express.Application = express();

application.use(cors());
application.use(express.json());
application.use("/static", express.static("static/", {
    index: Config.server.static.index,
    cacheControl: Config.server.static.cacheControl,
    maxAge: Config.server.static.maxAge,
    etag: Config.server.static.etag,
    dotfiles: Config.server.static.dotfiles
}));

const categoryService: CategoryService = new CategoryService();
const categoryController: CategoryController = new CategoryController(categoryService);

application.get("/category", categoryController.getAll.bind(categoryController));

application.use((req,res) =>{
res.sendStatus(404);
});
application.listen(Config.server.port);