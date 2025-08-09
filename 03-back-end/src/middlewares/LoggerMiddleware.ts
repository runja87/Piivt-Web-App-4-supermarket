import DevConfig from "../configs";
import morgan = require("morgan");
import * as fs from "fs";
import IConfig from "../common/IConfig.interface";
const config: IConfig = DevConfig;

export const LoggerMiddleware = morgan(config.logging.format, {
  stream: fs.createWriteStream(
    config.logging.path + "/" + config.logging.filename,
    { flags: "a" }
  ),
});
