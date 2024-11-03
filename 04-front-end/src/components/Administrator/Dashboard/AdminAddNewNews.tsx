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
  loadNews: (categoryId: number) => void;
}
interface INewsFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  alt: string | undefined;
  setAlt: React.Dispatch<React.SetStateAction<string>>;
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const AdminAddNewNews: React.FC<IAddNewsProps> = ({
  show,
  category,
  handleClose,
  loadNews,
}) => {
  const [errorMessage,setErrorMessage ] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [altText, setAlt] = useState<string>("");
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();

  const payload = {
    title,
    altText,
    content  
};  
  const doAddNews = () => {

    api("post", "/api/category/" + category.categoryId + "/news",payload)
    .then(res => {
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
      .then((news) => {
        if(!file){
          loadNews(category.categoryId);
          handleClose();
          throw new Error("No news photo selected!");
        }
        return {news,file};
      })
      .then(({file, news}) => {
        const data = new FormData();
        data.append("photo", file)
       return apiForm("post", "/api/category/"+ category.categoryId + "/news/" + news?.newsId + "/photo", data)
         .then(res => {
          if (res.status !== "ok") {
            throw new Error("Could not upload news photo! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
          }
          return res.data;
         })
      })
      .then(() => {
        navigate("/admin/dashboard/category/" + category.categoryId + "/news/list", {replace: true,});
        loadNews(category.categoryId);
        handleClose();
      })
      .catch(error => {
        setErrorMessage(error?.message ?? "Unknown error!");
      })
    
  };

  return (

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add new News to {category.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CategoryForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}    
          alt={altText}
          setAlt={setAlt}
          file={file}
          setFile={setFile}
        />
      {errorMessage}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {title.trim().length >= 4 && title.trim().length <= 64  && content.trim().length >= 50 && content.trim().length <= 500 && file !== undefined? (
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
        value={alt}
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
      <input type="file" accept=".jpg,.png" className="form-control form-control-sm"  onChange = { e => { if (e.target.files && e.target.files[0]) {setFile(e.target.files[0])}}}/>
      </div>
    </div>
  </>
);
export default AdminAddNewNews;


