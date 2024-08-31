import INews from "../../../models/INews.model";

export interface INewsPreviewProperties{
news: INews;
}


export default function IProductPreview(props: INewsPreviewProperties){
    
    return(
        <div>
              <p>News title: </p>
        <h2>
            { props.news.title}
        </h2>
        <p>Content: </p>
        <p>
            { props.news.content}
        </p>
        <p>
            { props.news.altText }
        </p>
     

       
    </div>


    );
   
}