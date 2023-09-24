
import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
import NewsModel from './NewsModel.model';
import IAddNews from "./dto/IAddNews.dto";
import IEditNews from "./dto/IEditNews.dto";




class INewsAdapterOptions implements IAdapterOptions { }

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
        news.photos = await this.services.photo.getAllByNewsId(news.newsId,DefaultCategoryAdapterOptions);
        return news;
    }

    public async getAllByCategoryId(categoryId: number, options: INewsAdapterOptions): Promise<NewsModel[] | null> {
        return this.getAllByFieldNameAndValue('category_id', categoryId, options);
    }

    public async add(data: IAddNews): Promise<NewsModel> {
        return this.baseAdd(data, {});
    }

    public async editById(newsId: number, data: IEditNews): Promise<NewsModel> {
        return this.baseEditById(newsId, data, {});
    }

    public async deleteById(newsId: number): Promise<boolean> {
        return this.baseDeleteById(newsId);
    }
}

export default NewsService;