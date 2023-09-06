import * as mysql2 from "mysql2/promise";
import CategoryService from "../components/category/CategoryService.service";
import NewsService from "../components/news/NewsService.service";
import AdministratorService from "../components/administrator/AdministratorService.service";
import ProductService from "../components/product/ProductService.service";
import PhotoService from "../components/photo/PhotoService.service";
import PageService from "../components/page/PageService.service";
import ContactService from "../components/contact/ContactService.service";

export interface IServices{
     category: CategoryService;
     news: NewsService;
     administrator: AdministratorService;
     product: ProductService;
     photo: PhotoService;
     page: PageService;
     contact: ContactService;

}


export default interface IApplicationResources {
     databaseConnection: mysql2.Connection;
     services?: IServices;
}