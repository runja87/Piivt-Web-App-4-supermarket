
import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import CategoryModel from "../category/CategoryModel.model";
import NewsModel from './NewsModel.model';
import IAddNews from "./dto/IAddNews.dto";
import IEditNews from "./dto/IEditNews.dto";





interface INewsAdapterOptions extends IAdapterOptions {
    loadPhotos: boolean;
    loadCategory: boolean;

}
const DefaultNewsAdapterOptions: INewsAdapterOptions = {
    loadPhotos: false,
    loadCategory: false,

}

class NewsService extends BaseService<NewsModel, INewsAdapterOptions> {
    tableName(): string {
        return "news";
    }

    protected async adaptToModel(data: any, options:INewsAdapterOptions): Promise<NewsModel> {
        const news: NewsModel = new NewsModel();
        news.newsId = +data?.news_id;
        news.title = data?.title;
        news.content = data?.content;
        news.altText = data?.alt_text;
        news.isDeleted = Boolean(data?.is_deleted);
        news.createdAt = data?.created_at;
        news.modifiedAt = data?.modified_at;
        news.categoryId = +data?.category_id;

        if(options.loadCategory){
            news.category = await this.services.category.getById(news.categoryId, {loadNews: false, loadProducts: false});
            
        }
        if(options.loadPhotos){
            news.photos = await this.services.photo.getAllByNewsId(news.newsId);
        }
   


        
        return news;
    }

    public async getAllByCategoryId(categoryId: number, options: INewsAdapterOptions): Promise<NewsModel[] | null> {
        return this.baseGetAllByFieldNameAndValue('category_id', categoryId, options);
    }

    public async add(data: IAddNews,options:INewsAdapterOptions): Promise<NewsModel> {
        return this.baseAdd(data, options);
    }

    public async editById(newsId: number, data: IEditNews, options: INewsAdapterOptions): Promise<NewsModel> {
        return this.baseEditById(newsId, data, options);
    }

    public async deleteById(newsId: number): Promise<boolean> {
        return this.baseDeleteById(newsId);
    }
}

export default NewsService;
export { DefaultNewsAdapterOptions };