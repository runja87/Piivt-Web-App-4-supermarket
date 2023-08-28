import { IServices } from "./IApplicationResources.interface";

export default abstract class BaseController {
    private servicesInstances: IServices;

    constructor(services: IServices){ 
        this.servicesInstances = services;
    }
    
    protected get services(): IServices{
        return this.servicesInstances;
    }
}