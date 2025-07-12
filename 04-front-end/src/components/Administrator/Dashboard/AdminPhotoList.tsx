import React, { useCallback, useEffect, useState } from "react";
import { api, apiForm } from "../../../api/api";
import { Button, Modal } from "react-bootstrap";
import IPhoto from "../../../models/IPhoto.model";
import { Link, useNavigate } from "react-router-dom";
import AdminAddNewPhoto from "./AdminAddNewPhoto";
import IConfig from "../../../common/IConfig.interface";
import DevConfig from "../../../configs";

interface IAdminPhotosListRowProperties {
  photo: IPhoto;
  loadPhotos: () => void;
}

interface DeleteWarningProps {
  show: boolean;
  handleClose: () => void;
  handleDelete: (photoId: number) => void;
  photo: IPhoto;
}

export default function AdminPhotosList() {
  const [photos, setPhotoData] = useState<IPhoto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const config: IConfig = DevConfig;

  function AdminPhotosListRow(props: IAdminPhotosListRowProperties) {
    const [altText, setAlt] = useState<string | undefined>(props.photo.altText);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const handleCloseDeleteWarning = () => setShowDeleteWarning(false);
    const navigate = useNavigate();

    const hasChanges = props.photo.altText !== altText || file !== undefined;

   


    const handleDelete = () => {
      api("delete", `/api/photo/${props.photo.photoId}`)
        .then((res) => {
          if (res.status !== "ok") {
            return setErrorMessage("Could not delete this product!");
          } else {
            loadPhotos();
          }
          
        })
        .catch((error) => {
          setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    const doEditPhoto = async () => {
      try {
        const updateRes = await api("put", `/api/photo/${props.photo.photoId}`, { altText });
        if (updateRes.status !== "ok") {
          throw new Error("Could not edit this photo!");
        }
  
        if (file) {
          const data = new FormData();
          data.append("name", file);
  
          const uploadRes = await apiForm("put", `/api/photo/${props.photo.photoId}`, data);
          if (uploadRes.status !== "ok") {
            throw new Error("Could not upload photo!");
          }
        }
  
        navigate("/admin/dashboard/gallery/list", { replace: true });
        loadPhotos();
      } catch (error) {
        setErrorMessage("An error occurred: " + error);
    
      }
    };
 

    return (
      <tr>
              <td>
        {!props.photo.newsId || !props.photo.productId || !props.photo.pageId ? (
          <img
            alt={props.photo.altText}
            src={`${config.domain.name}:${config.domain.port}/assets/${props.photo.filePath.replace(props.photo.name, "small-" + props.photo.name)}`}
          />
        ) : (
          <p>No image</p>
        )}
      </td>
        <td>
          <div className="input-group align">
            <input
              className="form-control form-control-sm "
              type="text"
              onChange={(e) => setAlt(e.target.value)}
              value={altText !== null ? altText : ""}
            />
          </div>
        </td>

        <td>
          <div className="form-group mb-3">
          {errorMessage}
            <div className="input-group">
              
              <input
                type="file"
                accept=".jpg,.png"
                className="form-control form-control-sm"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </div>
          </div>
        </td>

        <td>
          {hasChanges ? (
            <Button
              className="btn btn-dark btn-sm"
              onClick={doEditPhoto}
            >
              Save
            </Button>
          ) : (
            ""
          )}
        </td>

        <td>
          <div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setShowDeleteWarning(true)}
            >
              Delete
            </button>

            <DeleteWarning
              show={showDeleteWarning}
              handleClose={handleCloseDeleteWarning}
              handleDelete={handleDelete}
              photo={props.photo}
            />
          </div>
        </td>
      </tr>
    );
  }


  const loadPhotos = useCallback(() => {
    api("get", "/api/photos")
      .then(res => {
        if (res.status !== 'ok') {
          setErrorMessage(res.data + "");
        } else {
          setPhotoData(res.data);
        }
      })
      .catch(() => {
        setErrorMessage("An error occurred: " + errorMessage);
      });
  }, [errorMessage]); 

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);
  
  const handleShowAddPhoto = () => setShowAddPhoto(true);
  const handleCloseAddPhoto = () => setShowAddPhoto(false);

 
  return (
    <div>
      <Link className="btn btn-dark btn-sm" to="/admin/dashboard">
        &laquo; Back to AdminDashboard
      </Link>

          <div>
          <button
            className="btn btn-primary btn-sm me-10"
            onClick={handleShowAddPhoto}
          >
            Add New Photo
          </button>

          {showAddPhoto && (
            <AdminAddNewPhoto
              show={showAddPhoto}
              handleClose={handleCloseAddPhoto}
              loadPhotos={loadPhotos}
            />
          )}
        </div>

      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Edit alt text</th>
            <th>Change Photo</th>
            <th>Save</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {photos.map((photo) => (
            <AdminPhotosListRow key={"photo" + photo.photoId} photo={photo} loadPhotos={loadPhotos}/>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}

const DeleteWarning: React.FC<DeleteWarningProps> = ({
  show,
  handleClose,
  handleDelete,
  photo,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete {photo.name}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDelete(photo.photoId)}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

