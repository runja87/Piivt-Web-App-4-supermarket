import React, { useState } from "react";
import { api, apiForm } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import INews from "../../../models/INews.model";


interface IAddNewsProps {
  category: ICategory;
  news?: INews[];
  show: boolean;
  handleClose: () => void;
  loadProducts: (categoryId: number) => void;
}
interface INewsFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  alt: string;
  setAlt: React.Dispatch<React.SetStateAction<string>>;
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const AddNewNews: React.FC<IAddNewsProps> = ({
  show,
  category,
  handleClose,
  loadProducts,
}) => {
  const [,setErrorMessage ] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [alt, setAlt] = useState<string>("");
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();


  const doAddNews = () => {
    api("post", "/api/category/" + category.categoryId + "/news", { title,alt: alt || null,content,})
    .then(res => {
      console.log(res)
        if (res.status !== "ok") {
          throw new Error("Could not add this news!");
        }
        return res.data;
      })
      .then(news =>{
        if(!news?.newsId){
          throw new Error("Could not fetch new news data!");
        }
        return news;
      })
      .then(news => {
        if(!file){
          throw new Error("No news photo selected!");
        }
        return {
          file,
          news
        };
      })
      .then(({file, news}) => {
        const data = new FormData();
        data.append("photo", file)
       return apiForm("post", "/api/category/"+ category.categoryId + "/news/" + news[0].newsId + "/photo", data)
       .then(res => {
        if (res.status !== "ok") {
          throw new Error("Could not upload photo! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
        }
        return res.data;
       })
      })
      .then(photo => {
        navigate("/admin/dashboard/category/" + category.categoryId + "/news/list", {replace: true,});
      })
      .catch(error => {
        setErrorMessage(error?.message ?? "Unknown error!");
      })
      loadProducts(category.categoryId);
      handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New News to {category.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CategoryForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}    
          alt={alt}
          setAlt={setAlt}
          file={file}
          setFile={setFile}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {title.trim().length >= 4 && title.trim().length <= 64 ? (
          <Button variant="primary" onClick={doAddNews}>
            Save
          </Button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
};

const CategoryForm: React.FC<INewsFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  alt,
  setAlt,
  file,
  setFile,
  
}) => (
  <>
    <div className="form-group col-md-6">
      <label>Title:</label>
      <input
        type="text"
        className="form-control"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
    <div className="form-group">
      <label>Alt:</label>
      <input
        type="text"
        className="form-control"
        value={alt || ''}
        onChange={(e) => setAlt(e.target?.value)}
      />
    </div>
    <div className="form-group">
      <label>Content:</label>
      <textarea
        className="form-control"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
    <div className="form-group mb-3">
      <label>Upload product images</label>
      <div className="input-group">
      <input type="file" accept=".jpg,.png" className="form-control form-control-sm" onChange = { e => { if (e.target.files) {setFile(e.target.files[0])}}}/>
      </div>
    </div>
  </>
);
export default AddNewNews;


