import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
const ajv = new Ajv();


export default interface IAddPhoto extends IServiceData {
    name: string;
    //alt_text: string;
    file_path: string;
    product_id?: number|null;
    news_id?: number|null;
    page_id?: number|null;
}



