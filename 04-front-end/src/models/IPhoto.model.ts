import NewsModel from "../../../03-back-end/src/components/news/NewsModel.model";
import PageModel from "../../../03-back-end/src/components/page/PageModel.model";
import ProductModel from "../../../03-back-end/src/components/product/ProductModel.model";

export default interface IPhoto {
    photoId: number;
    name: string;
    altText: string;
    isDeleted:boolean;
    filePath: string;
    newsId: number;
    pageId: number;
    productId: number;
    
    pages?: PageModel[] | null;
    news?: NewsModel[] | null;
    product?: ProductModel[] | null;
}