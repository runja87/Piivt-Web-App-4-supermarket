import BaseService from "../../common/BaseService";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import PageModel from "./PageModel.model";
import IAddPage from "./dto/IAddPage.dto";
import IEditPage from "./dto/IEditPage.dto";






class IPageAdapterOptions implements IAdapterOptions { }

class PageService extends BaseService<PageModel, IPageAdapterOptions> {
    tableName(): string {
        return "page";
    }

    protected async adaptToModel(data: any): Promise<PageModel> {
        const page: PageModel = new PageModel();
        page.pageId = +data?.page_id;
        page.title = data?.title;
        page.content= data?.content;
        page.altText = data?.alt_text;
        page.isDeleted = Boolean(data?.is_deleted);
        page.createdAt = data?.created_at;
        page.modifiedAt = data?.modified_at;
        return page;
    }

    
    public async add(data: IAddPage): Promise<PageModel> {
        return this.baseAdd(data, {});
    }

    public async editById(pageId: number, data: IEditPage): Promise<PageModel> {
        return this.baseEditById(pageId, data, {});
    }

    public async deleteById(pageId: number): Promise<boolean> {
        return this.baseDeleteById(pageId);
    }
}

export default PageService;