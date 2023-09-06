
import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import NewsModel from './NewsModel.model';
import IAddNews from "./dto/IAddNews.dto";
import IEditNews from "./dto/IEditNews.dto";




class NewsAdapterOptions implements IAdapterOptions { }

class NewsService extends BaseService<NewsModel, NewsAdapterOptions> {
    tableName(): string {
        return "news";
    }

    protected async adaptToModel(data: any): Promise<NewsModel> {
        const news: NewsModel = new NewsModel();
        news.newsId = +data?.news_id;
        news.title = data?.title;
        news.content = data?.content;
        news.altText = data?.alt_text;
        news.isDeleted = Boolean(data?.is_deleted);
        news.createdAt = data?.created_at;
        news.modifiedAt = data?.modified_at;
        news.categoryId = +data?.category_id;
        return news;
    }

    public async getAllByCategoryId(categoryId: number, options: NewsAdapterOptions): Promise<NewsModel[] | null> {
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