import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import { Button, Modal } from "react-bootstrap";
import IPage from "../../../models/IPage.model";
import AdminAddNewPage from "./AdminAddNewPage";
import IConfig from "../../../common/IConfig.interface";
import DevConfig from "../../../configs";
import "./AdminPageList.sass";



interface IAdminPageListRowProperties {
  page: IPage;
}

interface DeleteWarningProps {
  show: boolean;
  handleClose: () => void;
  handleDelete: (nid: number) => void;
  page: IPage;
}

export default function AdminPagesList() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [page, setPageData] = useState<IPage[]>([]);
  const config: IConfig = DevConfig;

  useEffect(() => {
    loadPages();
  }, [errorMessage]);


  function loadPages(){

    api("get", "/api/page").then((res) => {
      if (res.status !== "ok") {
        return setErrorMessage(res.data + "");
      }
      return setPageData(res.data);
    });
  }

  const [showAddProduct, setShowAddPage] = useState(false);
  const handleShowAddPage = () => {
    setShowAddPage(true);
  };

  const handleCloseAddPage = () => {
    setShowAddPage(false);
  };

  function AdminPageListRow(props: IAdminPageListRowProperties) {
    const [title, setTitle] = useState<string>(props.page.title);
    const [content, setContent] = useState<string>(props.page.content);
    const [altText, setAlt] = useState<string | undefined>(props.page?.altText);
    const [file, setFile] = useState<File | undefined>();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const handleClose = () => setShowDeleteWarning(false);
    const hasChanges =
      props.page.title !== title ||
      props.page.content !== content ||
      props.page.altText !== altText ||
      file !== undefined;

    const DeleteWarning: React.FC<DeleteWarningProps> = ({
      show,
      handleClose,
      handleDelete,
      page,
    }) => {
      return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete {page.title}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(page.pageId)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

    const titleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    };
    const contentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };
    const altChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAlt(e.target.value);
    };

    const payload = {
      title,
      content,
      altText,
    };

    const doEditPage = (e: any) => {
      api(
        "put",
        "/api/page/" +
          props.page.pageId,
        payload
      )
        .then((res) => {
          if (res.status !== "ok") {
            throw new Error("Could not edit this page!");
          }
          return res.data;
        })
        .then((page) => {
          if (!page?.pageId) {
            throw new Error("Could not fetch new news data!");
          }
          return page;
        })
        .then((page) => {
          if (!file) {
            loadPages();
            throw new Error("No page photo selected!");
          }
          return { page, file };
        })
        .then(async ({ file, page }) => {
          const data = new FormData();
          data.append("photo", file);
          const res = await apiForm(
            "put",
            "/api/page/" + page.pageId + "/photo/" + props.page.photos[0].photoId,
            data
          );
          if (res.status !== "ok") {
            throw new Error(
              "Could not upload page photo! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
            );
          }
          return res.data;
        })
        .then(() => {
          navigate(
            "/admin/dashboard/pages/list",
            { replace: true }
          );
          loadPages();
          handleClose();
        })
        .catch((error) => {
          setErrorMessage(error?.message ?? "Unknown error!");
        });
     
    };

    const handleDelete = () => {
        api("delete", `api/page/${props.page.pageId}`)
          .then((res) => {
            if (res.status !== "ok") {
              return setErrorMessage("Could not delete this page!");
            }else {
              loadPages();
            }
           
          })
          .catch((error) => {
            setErrorMessage(error?.message ?? "Unknown error!");
          });
    
    };

    return (
      <tr>
        <td>
        {errorMessage}
          {props.page.photos?.length > 0 ? (
            <img
              alt={props.page.photos[0]?.altText}
              src={`${config.domain.name}:${config.domain.port}/assets/${props.page.photos[0].filePath.replace(props.page.photos[0].name,"small-" + props.page.photos[0].name)}`}
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
              onChange={(e) => titleChanged(e)}
              value={title !== null ? title : ""}
            />
          </div>
        </td>
        <td>
          <div className="input-group align">
            <input
              className="form-control form-control-sm "
              type="text"
              onChange={(e) => altChanged(e)}
              value={altText !== null ? altText : ""}
            />
          </div>
        </td>
        <td>
          <div className="input-group align">
            <textarea
              className="form-control form-control-sm "
              onChange={(e) => contentChanged(e)}
              value={content !== null ? content : ""}
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
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        </td>

        <td>
          {hasChanges ? (
            <Button
              className="btn btn-dark btn-sm"
              onClick={(e) => doEditPage(e)}
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
              handleClose={handleClose}
              handleDelete={handleDelete}
              page={props.page}
            />
          </div>
        </td>
      </tr>
    );
  }

 
    return (
      <div className="admin-pages-container">
      <Link className="btn btn-dark btn-sm btn-back" to="/admin/dashboard">
        &laquo; Back to AdminDashboard
      </Link>
      <button
        className="btn btn-primary btn-sm btn-add"
        onClick={handleShowAddPage}
      >
        Add New Page
      </button>
    
      {showAddProduct && (
        <AdminAddNewPage
          show={showAddProduct}
          handleClose={handleCloseAddPage}
          loadPages={loadPages}
        />
      )}
    
      <div className="table-wrapper">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Title</th>
              <th>Alt</th>
              <th>Content</th>
              <th>Upload new photo</th>
              <th>Save</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {page?.map((page) => (
              <AdminPageListRow key={"page" + page.pageId} page={page} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
    );
  }

