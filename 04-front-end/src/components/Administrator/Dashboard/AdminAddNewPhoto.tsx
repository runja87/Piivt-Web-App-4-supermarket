import React, { useState } from "react";
import { apiForm } from "../../../api/api";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


interface IAddPhotoProps {
  show: boolean;
  handleClose: () => void;
  loadPhotos: () => void;
}
interface IPhotoFormProps {
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}


const AdminAddNewPhoto: React.FC<IAddPhotoProps> = ({
  show,
  loadPhotos,
  handleClose,
}) => {
  const [ errorMessage ,setErrorMessage ] = useState<string>("");
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();


  const doAddPhoto = () => {
 
        if(!file){
          throw new Error("No photo selected!");
        }
          const data = new FormData();
          data.append("photo", file)
         return apiForm("post", "/api/photo", data)
         .then(res => {
          if (res.status !== "ok") {
            throw new Error("Could not upload photo! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
          }
          return res.data;
         })
      
        .then(() => {
          navigate("/admin/dashboard/gallery/list", {replace: true,});
          loadPhotos();
          handleClose();
        })
        .catch(error => {
          setErrorMessage(error?.message ?? "Unknown error!");
        })

        

      }
  

    

  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Photo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CategoryForm  
          file={file}
          setFile={setFile}
        />
         {errorMessage}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
       
        { file !== undefined ? (
          <Button variant="primary" onClick={doAddPhoto}>
            Save
          </Button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
};

const CategoryForm: React.FC<IPhotoFormProps> = ({
  setFile,
}) => (
  <>
    <div className="form-group mb-3">
      <label>Upload product images</label>
      <div className="input-group">
      <input type="file" accept=".jpg,.png" className="form-control form-control-sm" onChange = { e => { if (e.target.files) {setFile(e.target.files[0])}}}/>
      </div>
    </div>
  </>
);
export default AdminAddNewPhoto;


