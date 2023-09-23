import { Request, Response } from 'express';
import { IServices } from "./IApplicationResources.interface";
import { mkdirSync, readFileSync, unlinkSync } from 'fs';
import { UploadedFile } from 'express-fileupload';
import filetype from 'magic-bytes.js';
import sizeOf from "image-size";
import * as uuid from "uuid";
import { extname} from 'path';


export default abstract class BaseController {
    private servicesInstances: IServices;

    constructor(services: IServices){ 
        this.servicesInstances = services;
    }    
    protected get services(): IServices{
        return this.servicesInstances;
    }
    protected async doFileUpload(req: Request, res: Response): Promise<string [] | null> {
        if (!req.files || Object.keys(req.files).length === 0) {
          res.status(400).send("No files were uploaded!");
          return null;
        }
    
        const fileFieldNames = Object.keys(req.files);
    
        const now = new Date();
        const year = now.getFullYear();
        const month = ((now.getMonth() + 1) + "").padStart(2, "0");
    
        const uploadDestinationRoot = "./static/";
        const destinationDirectory = "uploads/" + year + "/" + month + "/";
        mkdirSync(uploadDestinationRoot + destinationDirectory, {
          recursive: true,
          mode: "755",
        });
    
        const uploadPromises = fileFieldNames.map(fileFieldName => {
            return new Promise<string | null> ((resolve, reject) => {
                const file = req.files[fileFieldName] as UploadedFile;
                const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;
    
                if (!["png", "jpg"].includes(type)) {
                  unlinkSync(file.tempFilePath);
                  res.status(415).send("File type is not supported!");
                  return null;
                }
                const declaredExtension = extname(file.name);
          
                if (![".png", ".jpg"].includes(declaredExtension)) {
                  unlinkSync(file.tempFilePath);
                  res.status(415).send("File extension is not supported!");
                  return null;
                }
          
                const size = sizeOf(file.tempFilePath);
          
                if (size.width < 320 || size.width > 1920) {
                  unlinkSync(file.tempFilePath);
                  res.status(415).send("Image width is not supported!");
                  return null;
                }
                if (size.height < 240 || size.height > 1080) {
                  unlinkSync(file.tempFilePath);
                  res.status(415).send("Image height is not supported!");
                  return null;
                }
                const fileNameRandomPart: string = uuid.v4();
                const fileDestinationPath: string = uploadDestinationRoot + destinationDirectory + fileNameRandomPart + "-" + file.name;
    
                file.mv(fileDestinationPath, error => {
                    if (error) {
                       return reject(error);
                    } else {
                
                        resolve(destinationDirectory + fileNameRandomPart + "-" + file.name);
                    }
                });
            });
        });
    
        try {
            
            const results = await Promise.all(uploadPromises);
            return results;

        } catch (error) {
            // This means one of the file uploads failed
            res.status(500).send(error.message || 'Error uploading files');
        }
    }
    


    
    
}