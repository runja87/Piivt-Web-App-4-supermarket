export default interface IPhoto {
    photoId: number;
    name: string;
    altText: string | undefined;
    isDeleted:boolean;
    filePath: string;
    newsId: number | undefined;
    pageId: number | undefined;
    productId: number | undefined;
}