import React, { useState } from "react";
import { api, apiForm } from "../../../api/api";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import IPage from "../../../models/IPage.model";


interface IAddPageProps {
  pages?: IPage[];
  show: boolean;
  handleClose: () => void;
  loadPages: () => void;
}
interface IPageFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  alt: string | undefined;
  setAlt: React.Dispatch<React.SetStateAction<string>>;
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const AdminAddNewPage: React.FC<IAddPageProps> = ({
  show,
  handleClose,
  loadPages,
}) => {
  const [,setErrorMessage ] = useState<string>("");
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
  const doAddPage = () => {

    api("post", "/api/page",payload)
    .then(res => {
        if (res.status !== "ok") {
          throw new Error("Could not add this page!");
        }
        return res.data as IPage;
      })
      .then(page =>{
        if(!page.pageId){
          throw new Error("Could not fetch new page data!");
        }
        return page;
      })
      .then((page) => {
        if(!file){
          handleClose();
          loadPages();
          throw new Error("No photo for this page selected!");
        }
        return {page,file};
      })
      .then(async ({file, page}) => {
        const data = new FormData();
        data.append("photo", file)
       const res = await apiForm("post", `/api/page/${page.pageId}/photo`,data);
        if (res.status !== "ok") {
          throw new Error("Could not upload page photo! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
        }
        return res.data;
      })
      .then(() => {
        navigate("/admin/dashboard/pages/list", {replace: true,});
        handleClose();
        loadPages();
      })
      .catch(error => {
        setErrorMessage(error?.message ?? "Unknown error!");
      })
    
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add new Page</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PageForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}    
          alt={altText}
          setAlt={setAlt}
          file={file}
          setFile={setFile}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {title.trim().length >= 4 && title.trim().length <= 64 && content.trim().length >= 50 && content.trim().length <= 2000 && file !== undefined ? (
          <Button variant="primary" onClick={doAddPage}>
            Save
          </Button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
};

const PageForm: React.FC<IPageFormProps> = ({
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
        value={alt || ""}
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
      <label>Upload page images</label>
      <div className="input-group">
      <input type="file" accept=".jpg,.png" className="form-control form-control-sm"  onChange = { e => { if (e.target.files && e.target.files[0]) {setFile(e.target.files[0])}}}/>
      </div>
    </div>
  </>
);
export default AdminAddNewPage;


