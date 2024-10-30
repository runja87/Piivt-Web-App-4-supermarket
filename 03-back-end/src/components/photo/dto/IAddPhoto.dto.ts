import IServiceData from "../../../common/IServiceData.interface";


export default interface IAddPhoto extends IServiceData {
    name: string;
    file_path: string;
    product_id?: number;
    news_id?: number;
    page_id?: number;
}





