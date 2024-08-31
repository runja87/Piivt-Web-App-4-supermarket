import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ICategory from "../../../models/ICategory.model";
import { api } from "../../../api/api";
import { Button, Modal } from "react-bootstrap";
import AddNewNews from "./AddNewNews";
import INews from "../../../models/INews.model";





export interface IAdminCategoryNewsListUrlParams extends Record<string, string | undefined> {
    cid: string
}

interface IAdminNewsListRowProperties{
    news: INews;
    category: ICategory;
}

interface DeleteWarningProps {
    show: boolean;
    handleClose: () => void;
    handleDelete: (cid: number, nid: number) => void;
    news: INews; 
    category: ICategory;
}

export default function AdminCategoryProductList(){
    const params = useParams<IAdminCategoryNewsListUrlParams>();
    const [ category, setCategoryData ] = useState<ICategory>();
    const categoryId = params.cid;
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {
        loadProduct(+(categoryId ?? 0));
    }, [categoryId]);

    function loadProduct(categoryId: number) {
        if(!categoryId) {
            return;
        }

        api("get", "/api/category/" + categoryId)
        .then(res => {
            if(res.status !== 'ok'){
                return setErrorMessage(res.data + "");
            }
            setCategoryData(res.data);
        });

    }

    function AdminProductListRow(props: IAdminNewsListRowProperties){
        const [title, setTitle ] = useState<string>(props.news.title);
        const [content, setContent] = useState<string>(props.news.content);
        const [alt, setAlt] = useState<string | undefined>(props.news?.altText);

       
        const [showDeleteWarning, setShowDeleteWarning] = useState(false);
        const handleClose = () => setShowDeleteWarning(false);
        const hasChanges = props.news.title !== title || props.news.content !== content || props.news.altText !== alt;


    
        const titleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle( e.target.value );
        }
        const contentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
        };
        const altChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAlt(e.target.value);
        };


        

        const doEditNews= (e: any) => {
         api("put", "/api/category/" + props.category.categoryId + "/news/" + props.news.newsId, { title,content,alt: alt || null })
         .then(res => {
            if(res.status !== 'ok'){
                return setErrorMessage("Could not edit this product");
            }
            loadProduct(+(params.cid ?? 0));
         })
        }
    
        const handleDelete = ((cid: number)  => { 
            if (params.cid) {
                api("delete", `/api/category/${cid}/news/${props.news.newsId}`)
                    .then(res => {
                        if (res.status !== 'ok') {
                            return setErrorMessage("Could not delete this product!");
                        }
                        loadProduct(+(params.cid ?? 0));
                    });
                console.log('Item deleted');
                setShowDeleteWarning(false);
            }
        });
  
        
        return (
            
            <tr>
            <td>
            { 
            props.news.photos.length > 0 ? <img alt={props.news.photos[props.news.newsId]?.altText} src={"http://localhost:10000/assets/" + props.news.photos[0].filePath.replace(props.news.photos[0].name, "small-"+props.news.photos[0].name)}/>
            : <p>No image</p>
            }
            </td>
            <td>
             
                <div className="input-group align">
                    
                    <input className="form-control form-control-sm " 
                       type="text"
                       onChange={ e => titleChanged(e)} 
                       value={ title }/>
                       
                          
                </div>     
            </td>
            <td>
            <div className="input-group align">
                    
                    <input className="form-control form-control-sm " 
                       type="text"
                       onChange={ e => altChanged(e)} 
                       value={ alt || undefined }/>
                          
                </div>     
            </td> 
            <td>
            <div className="input-group align">
                    
                    <textarea className="form-control form-control-sm " 
                       onChange={ e => contentChanged(e)} 
                       value={ content }/>
                          
                </div>     
            </td> 
       
        <td>
            
        </td>
        <td>
  { hasChanges ? 
    <Button className="btn btn-dark btn-sm" onClick={e => doEditNews(e)}>
      Save
    </Button> : '' }
</td>
          
            <td>
                     <div>
                <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteWarning(true)}>
                    Delete
                </button>
    
                <DeleteWarning 
                    show={showDeleteWarning}
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                    news={props.news}
                    category={props.news.category}
                />
            </div>
           
              
            </td>
            </tr>
            
            
        )
        
    
    }
    
    const DeleteWarning: React.FC<DeleteWarningProps> = ({ show, handleClose, handleDelete, news, category}) => {
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {news.title}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(category.categoryId, news.newsId)}>
    
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

const [showAddProduct, setShowAddProduct] = useState(false);
const handleShowAddProduct = () => {
    setShowAddProduct(true);
};

const handleCloseAddProduct = () => {
    setShowAddProduct(false);
};   
       
function renderProductTable(category: ICategory) {

return(
    
<div>
    <Link className="btn btn-dark btn-sm" to="/admin/dashboard/category/list">
        &laquo; Back to categories &quot; {category.name }&quot;
    </Link>
    <div>
        <button className="btn btn-primary btn-sm me-10"  onClick={handleShowAddProduct}>Add New News</button>
      
            {showAddProduct && (
              <AddNewNews
                category={category}
                news={category.news}
                show={showAddProduct}
                handleClose={handleCloseAddProduct}
                loadProducts={loadProduct}
              />
            )}
            </div>
    
<table className="table table-sm table-hover">
<thead>
    <tr>
<th>Photo</th>
<th>Title</th>
<th>Alt</th>
<th>Content</th>
<th></th>
<th>Save</th>
<th>Delete</th>

    </tr>
</thead>
<tbody>
{category.news?.map(news => <AdminProductListRow key={"news" + news.newsId} news={news} category={category}/>)}
</tbody>
</table>
</div>
);
}

    return (
        <div>
            { errorMessage && <p className="alert-danger mb-3">{ errorMessage }</p>}
            { category && renderProductTable(category) }

        </div>
    );
}
