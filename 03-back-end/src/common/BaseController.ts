import { Request, Response } from 'express';
import { IServices } from "./IApplicationResources.interface";
import { mkdirSync, readFileSync, unlinkSync } from 'fs';
import { UploadedFile } from 'express-fileupload';
import filetype from 'magic-bytes.js';
import sizeOf from "image-size";
import * as uuid from "uuid";
import { extname } from 'path';
import IConfig, { IResize } from './IConfig.interface';
import DevConfig from '../configs';
import * as sharp from "sharp";


export default abstract class BaseController {

  private servicesInstances: IServices;

  constructor(services: IServices) {
    this.servicesInstances = services;
  }
  protected get services(): IServices {
    return this.servicesInstances;
  }
  protected async doFileUpload(req: Request, res: Response): Promise<string[] | null> {
    const config: IConfig = DevConfig;
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send("No files were uploaded!");
      return null;
    }

    const fileFieldNames = Object.keys(req.files);

    const now = new Date();
    const year = now.getFullYear();
    const month = ((now.getMonth() + 1) + "").padStart(2, "0");

    const uploadDestinationRoot = config.server.backend.static.path + "/";
    const destinationDirectory = config.fileUploads.destinationDirectoryRoot + year + "/" + month + "/";
    mkdirSync(uploadDestinationRoot + destinationDirectory, {
      recursive: true,
      mode: "755",
    });

    const uploadPromises = fileFieldNames.map(fileFieldName => {
      return new Promise<string | null>((resolve, reject) => {
        const file = req.files[fileFieldName] as UploadedFile;
        const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;

        if (!config.fileUploads.photos.allowedTypes.includes(type)) {
          unlinkSync(file.tempFilePath);
          res.status(415).send("File type is not supported!");
          return null;
        }
        const declaredExtension = extname(file.name);

        if (!config.fileUploads.photos.allowedExtensions.includes(declaredExtension)) {
          unlinkSync(file.tempFilePath);
          res.status(415).send("File extension is not supported!");
          return null;
        }

        const size = sizeOf(file.tempFilePath);

        if (size.width < config.fileUploads.photos.width.min || size.width > config.fileUploads.photos.width.max) {
          unlinkSync(file.tempFilePath);
          res.status(415).send("Image width is not supported!");
          return null;
        }
        if (size.height < config.fileUploads.photos.height.min || size.height > config.fileUploads.photos.height.max) {
          unlinkSync(file.tempFilePath);
          res.status(415).send("Image height is not supported!");
          return null;
        }
        const fileNameRandomPart: string = uuid.v4();
        const fileDestinationPath: string = uploadDestinationRoot + destinationDirectory + fileNameRandomPart + "-" + file.name;

        file.mv(fileDestinationPath, async error => {
          if (error) {
            if (error) {
            res.status(500).send(`File ${fileFieldName} - could not be saved on the server!`);
            }
            return null;
          } else {

            resolve(destinationDirectory + fileNameRandomPart + "-" + file.name);

            for(let resizeOptions of config.fileUploads.photos.resize)
            await this.createResizedPhotos(fileNameRandomPart + "-" + file.name, destinationDirectory,  resizeOptions);
          }
        });
      });
    });

    try {

      const results = await Promise.all(uploadPromises);
      return results;

    } catch (error) {
      // This means one of the file uploads failed
      res.status(500).send(error.message || 'Error uploading file');
    }
  }

  private async createResizedPhotos(fileName: string, directory: string, resizeOptions: IResize) {
    const config: IConfig = DevConfig;
    await sharp(config.server.backend.static.path + "/" + directory + fileName)
      .resize({
        width: resizeOptions.width,
        height: resizeOptions.height,
        fit: resizeOptions.fit,
        background: resizeOptions.defaultBackground,
        withoutEnlargement: true,
      })
      .toFile(config.server.backend.static.path + "/" + directory + resizeOptions.prefix + fileName);

  }





}