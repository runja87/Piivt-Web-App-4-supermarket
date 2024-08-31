
import { useEffect, useState } from "react";
import ICategory from "../../../models/ICategory.model"
import IProduct from "../../../models/IProduct.model";
import INews from "../../../models/INews.model";
import IProductPreview from '../Product/ProductPreview';
import INewsPreview from '../News/NewsPreview';
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";



export interface IUserCategoryPageUrlParams extends Record<string, string | undefined>{
    id: string
}

export default function UserCategoryPage() {
const [ category, setCategory] = useState<ICategory|null>(null);
const [ products, setProduct] = useState<IProduct[]>([]);
const [ news, setNews] = useState<INews[]>([]);
const [ errorMessage, setErrorMessage ] = useState<string>("");
const [ loading, setLoading ]       = useState<boolean>(false);

const params = useParams<IUserCategoryPageUrlParams>();

useEffect(() => {
    setLoading(true);
    api("get", "/api/category/" + params.id)
    .then(res => {
        if(res.status === 'error'){
            throw new Error('Could not get category data!');
        }
        setCategory(res.data);
     
    })
    .then(() => {
        return api("get", "/api/category/" + params.id +  "/product")
    })
    .then(res => {
        if(res.status === 'error'){
            throw new Error('Could not get product!');
            
        }
        setProduct(res.data);
     
    })
    .then(() => {
        return api("get", "/api/category/" + params.id +  "/news")
    })
    .then(res => {
        if(res.status === 'error'){
            throw new Error('Could not get news!');
        }
        setNews(res.data);
     
    })
    .catch(error => {
        setErrorMessage(error?.message ?? 'Unknown error while loading this category!');
    })
    .finally(() => {
        setLoading(false);
    });
}, [params.id]);

return (
    <div>
        {loading && <p>Loading...</p>}
        {errorMessage && <p>Error: {errorMessage}</p>}
        {category && (
            <div>
                <h1>{category.name}</h1>
                {products && (
                    <div>
                           { products.map( product => <IProductPreview key={"prduct-" + product.productId} product={ product}/>)}
                           { news.map( news => <INewsPreview key={"news-" + news.newsId} news={ news }/>)} 
                      
                    </div>
                )}
            </div>
        )}
    </div>
)

};
